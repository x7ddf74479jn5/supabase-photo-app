import type { NextPage } from 'next';

import { AccountEdit } from '@/components/page/AccountEdit';
import { Layout } from '@/components/ui/Layout';

const AccountEditPage: NextPage = () => {
  return (
    <Layout>
      <AccountEdit />
    </Layout>
  );
};

export default AccountEditPage;
