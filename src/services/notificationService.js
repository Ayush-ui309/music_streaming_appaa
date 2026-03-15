import { supabase } from './supabaseClient';

export const notificationService = {

  async getNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) return [];
    return data || [];
  },

  async addNotification(message, type = 'info') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('notifications').insert([{
      user_id: user.id,
      message,
      type,
    }]);
  },

  async markAllRead() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
  },

  async getUnreadCount() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    return count || 0;
  }
};
