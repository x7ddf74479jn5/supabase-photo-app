import type { GetServerSidePropsContext, NextPage } from 'next';

import { Top } from '@/components/page/Top';
import { Layout } from '@/components/ui/Layout';
import { PublicPhoto } from '@/types';
import { getPublishedPhotoListServer } from '@/usecases/photo';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  const publicPhotos = (await getPublishedPhotoListServer()) ?? [];

  return { props: { publicPhotos } };
}

type props = {
  publicPhotos: PublicPhoto[];
};

const Home: NextPage<props> = ({ publicPhotos }) => {
  return (
    <Layout>
      <Top publicPhotos={publicPhotos} />
    </Layout>
  );
};

export default Home;
