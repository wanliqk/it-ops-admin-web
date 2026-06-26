import { fetchGetAdminUserList } from '@/service/api';

/**
 * remote-search options for the leader/member user selects — reuses the existing user list endpoint
 * (filtered to active users) rather than hardcoding any user data, per the task's explicit requirement.
 * Shows "姓名 / 用户名 / 手机号" so admins can disambiguate same-name users.
 */
export async function searchActiveUserOptions(keyword: string): Promise<CommonType.Option<number>[]> {
  const { data, error } = await fetchGetAdminUserList({ keyword, status: 1, current: 1, size: 20 });

  if (error || !data) {
    return [];
  }

  return data.records.map(user => ({
    label: `${user.realName} / ${user.userName} / ${user.phone}`,
    value: user.id
  }));
}
