const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAuthState() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { user: null, profile: null };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  return { user: session.user, profile };
}

async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();

  return { success: !error, data, error };
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  return !error;
}
