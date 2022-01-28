import type { NextPage } from 'next';

import { Account } from '@/components/page/Account';
import { Layout } from '@/components/ui/Layout';

const AccountPage: NextPage = () => {
  return (
    <Layout>
      <Account />
    </Layout>
  );
};

export default AccountPage;
