import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ResendDto } from './dto/resend.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginGoogleDto } from './dto/login-google.dto';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(dto: RegisterDto) {
    const supabase = this.supabaseService.getClient();

    // normalisasi dulu
    const email = dto.email.toLowerCase().trim();
    const username = dto.username.trim();

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password tidak sama');
    }

    // cek email sudah ada
    const { data: emailExist } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (emailExist) {
      throw new BadRequestException('Email sudah digunakan');
    }

    // cek username sudah ada
    const { data: usernameExist } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (usernameExist) {
      throw new BadRequestException('Username sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: username,
          name: dto.name,
          email: email,
          password: hashedPassword,
          role: 'user',
          is_email_verified: false,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    delete data.password;

    return {
      message: 'Register berhasil! Silakan login untuk melanjutkan.',
      user: data,
    };
  }

  async verifyEmail(token: string) {
    const supabase = this.supabaseService.getClient();

    // Verifikasi JWT
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException(
        'Token verifikasi tidak valid atau kadaluarsa',
      );
    }

    if (payload.purpose !== 'email-verification') {
      throw new BadRequestException('Token tidak valid');
    }

    const userId = payload.sub;

    // Cari user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user || error) {
      throw new BadRequestException('User tidak ditemukan');
    }

    if (user.is_email_verified) {
      throw new BadRequestException('Email sudah diverifikasi sebelumnya');
    }

    // Update status verifikasi and record as recent activity
    const { error: updateError } = await supabase
      .from('users')
      .update({
        is_email_verified: true,
        last_login: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Gagal update verifikasi:', updateError);
      throw new BadRequestException(
        'Gagal memverifikasi email: ' + updateError.message,
      );
    }

    return { message: 'Email berhasil diverifikasi' };
  }

  // 30 days expressed in milliseconds – used to enforce inactivity logout
  private INACTIVITY_LIMIT = 30 * 24 * 60 * 60 * 1000; // 30 days

  async login(dto: LoginDto) {
    const supabase = this.supabaseService.getClient();

    // cari user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', dto.email)
      .single();

    if (!user || error) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }

    // 1. Cek password
    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    let isEmailVerified = user.is_email_verified;

    // 2. Cek inactivity window
    if (user.last_login) {
      const last = new Date(user.last_login).getTime();
      if (Date.now() - last > this.INACTIVITY_LIMIT) {
        isEmailVerified = false;
        // set unverified di DB tapi jangan block login
        await supabase
          .from('users')
          .update({ is_email_verified: false })
          .eq('id', user.id);
      }
    }

    // 3. Jika statusnya unverified (baru register atau kena inactivity), kirim email verifikasi di background
    if (!isEmailVerified) {
      const verificationToken = this.jwtService.sign(
        { sub: user.id, purpose: 'email-verification' },
        { expiresIn: '24h' },
      );

      this.mailService
        .sendVerificationEmail(user.email, user.name, verificationToken)
        .catch((e) =>
          console.error('Gagal mengirim email verifikasi otomatis:', e),
        );
    }

    return this.generateTokens(user, isEmailVerified);
  }

  private async generateTokens(user: any, isEmailVerified: boolean) {
    const supabase = this.supabaseService.getClient();

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // simpan refresh token + update last_login ke database
    const { error: finalUpdateError } = await supabase
      .from('users')
      .update({
        refresh_token: refreshToken,
        last_login: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (finalUpdateError) {
      console.error('Gagal update token/last_login:', finalUpdateError);
    }

    delete user.password;
    user.is_email_verified = isEmailVerified;

    return {
      message: isEmailVerified
        ? 'Login berhasil'
        : 'Login berhasil, silakan verifikasi email Anda untuk akses penuh.',
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const supabase = this.supabaseService.getClient();

    // 1. Bersihkan token (siapa tau ada user yang input "Bearer " di body)
    let token = dto.refresh_token.trim();
    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    // 2. Verify refresh token
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Refresh token sudah expired, silakan login ulang',
        );
      }
      throw new UnauthorizedException(
        'Refresh token tidak valid: ' + e.message,
      );
    }

    // 3. Cari user dan cek apakah refresh token cocok di DB
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.sub)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    // cek refresh token manual
    if (user.refresh_token !== token) {
      throw new UnauthorizedException('Refresh token tidak cocok');
    }

    // 4. Generate new access token
    const newPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });

    return {
      access_token: accessToken,
    };
  }

  async resendVerificationEmail(dto: ResendDto) {
    const supabase = this.supabaseService.getClient();

    // cek user
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', dto.email.toLowerCase().trim())
      .single();

    if (!user) {
      throw new BadRequestException('Email tidak terdaftar');
    }

    if (user.is_email_verified) {
      throw new BadRequestException('Email sudah diverifikasi');
    }

    const verificationToken = this.jwtService.sign(
      { sub: user.id, purpose: 'email-verification' },
      { expiresIn: '24h' },
    );

    await this.mailService.resendEmailVerification(
      user.email,
      user.name,
      verificationToken,
    );

    return {
      message: 'Email verifikasi telah dikirim ulang. Silahkan cek email kamu.',
    };
  }

  async forgotPassword(email: string) {
    const supabase = this.supabaseService.getClient();
    const emailNormalized = email.toLowerCase().trim();

    const { data: user } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', emailNormalized)
      .single();

    if (!user) {
      throw new NotFoundException('Email tidak ditemukan');
    }

    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    await supabase
      .from('users')
      .update({
        reset_otp: otp,
        reset_otp_expires_at: expiresAt,
      })
      .eq('id', user.id);

    await this.mailService.sendForgotPasswordEmail(user.email, user.name, otp);

    return { message: 'OTP berhasil dikirim ke email' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const supabase = this.supabaseService.getClient();
    const { email, otp, password, confirmPassword } = dto;

    const emailNormalized = email.toLowerCase().trim();

    if (password !== confirmPassword) {
      throw new BadRequestException('Password tidak cocok');
    }

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', emailNormalized)
      .single();

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    if (user.reset_otp !== otp) {
      throw new UnauthorizedException('OTP salah');
    }

    if (new Date(user.reset_otp_expires_at) < new Date()) {
      throw new UnauthorizedException('OTP sudah expired');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await supabase
      .from('users')
      .update({
        password: hashedPassword,
        reset_otp: null,
        reset_otp_expires_at: null,
      })
      .eq('id', user.id);

    return { message: 'Password berhasil diubah' };
  }

  async loginGoogle(dto: LoginGoogleDto) {
    const supabase = this.supabaseService.getClient();
    const email = dto.email.toLowerCase().trim();

    // 1. Cari user
    let { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    // 2. Jika tidak ada, buat user baru
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            name: dto.name,
            email,
            avatar: dto.avatar,
            username: email.split('@')[0] + Math.floor(Math.random() * 1000),
            role: 'user',
            is_email_verified: true, // Google email is usually verified
          },
        ])
        .select()
        .single();

      if (createError) {
        throw new BadRequestException('Gagal membuat user Google: ' + createError.message);
      }
      user = newUser;
    }

    // 3. Generate tokens (Google login is always verified)
    const result = await this.generateTokens(user, true);

    return {
      ...result,
      message: 'Login Google berhasil',
    };
  }
}
