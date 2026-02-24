import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SupabaseService {
    private supabase;

    constructor() {
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.log('✅ Supabase initialized with SERVICE_ROLE_KEY');
        } else {
            console.log('⚠️ Supabase initialized with ANON_KEY (RLS might block this)');
        }

        this.supabase = createClient(
            process.env.SUPABASE_URL as string,
            key as string,
        );
    }

    getClient(accessToken?: string) {
        if (accessToken) {
            return createClient(
                process.env.SUPABASE_URL as string,
                process.env.SUPABASE_KEY as string,
                {
                    global: {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                },
            );
        }
        return this.supabase;
    }
}
