'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useEffect, useMemo, useState } from 'react';
import { getBrowserClient } from '@/lib/supabaseBrowser';

