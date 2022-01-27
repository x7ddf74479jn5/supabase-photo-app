import type { GetServerSidePropsContext, NextPage } from 'next';

import { UserPhotoEdit } from '@/components/model/User';
import { Layout } from '@/components/ui/Layout';
import { PublicPhoto } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { getPhotoServer } from '@/usecases/photo';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const { token } = await supabase.auth.api.getUserByCookie(req);

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const photoData = getPhotoServer(String(params?.id));

  if (!photoData) {
    return { notFound: true };
  }
  return { props: { photoData } };
}

type props = {
  photoData: PublicPhoto;
};

const UserPhotoEditPage: NextPage<props> = ({ photoData }) => {
  return (
    <Layout>
      <UserPhotoEdit photoData={photoData} />
    </Layout>
  );
};

export default UserPhotoEditPage;
