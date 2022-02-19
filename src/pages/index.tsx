import type { NextPage } from 'next';

import { Top } from '@/components/page/Top';
import { Layout } from '@/components/ui/Layout';
import { usePublishedPhotoList } from '@/usecases/photo';

const Home: NextPage = ({}) => {
  const publicPhotos = usePublishedPhotoList();

  return (
    <Layout>
      <Top publicPhotos={publicPhotos ?? []} />
    </Layout>
  );
};

export default Home;
