import Link from 'next/link';
import { ImageContainer, SucessContainer } from '../styles/pages/sucess';
import { GetServerSideProps } from 'next';
import { stripe } from '../lib/stripe';
import Stripe from 'stripe';
import Image from 'next/image';
import Head from 'next/head';

interface SuccessProps {
  customerName: string;
  product: {
    name: string;
    imageUrl: string;
  };
}

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>
        <meta name="robots" content="noindex" />
      </Head>

      <SucessContainer>
        <h1>Compra Efetuada!</h1>
        <ImageContainer>
          <Image src={product.imageUrl} width={120} height={110} alt="" />
        </ImageContainer>

        <p>
          Uhuul <strong>{customerName}</strong>, sua{' '}
          <strong>{product.name}</strong> já está a caminho da sua casa.
        </p>
        <Link href="/">Voltar ao Catálogo</Link>
      </SucessContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  params
}) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }
  const sessionId = String(query.session_id);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  });

  console.log(session.line_items.data);

  const customerName = session.customer_details.name;
  const product = session.line_items.data[0].price.product as Stripe.Product;

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0]
      }
    }
  };
};
