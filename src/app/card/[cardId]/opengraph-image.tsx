
import { ImageResponse } from 'next/og';
import { getCardData } from './page';
import SharingCard from '@/components/sharing-card';
import { personas } from '@/lib/personas';

export const runtime = 'edge';

export const alt = 'The Executive Jokester';
export const size = {
  width: 400,
  height: 500,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { cardId: string } }) {
  const cardData = await getCardData(params.cardId);

  if (!cardData) {
    // Return a default "not found" image
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: '#020617',
            color: '#FBBF24',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Space Grotesk"',
          }}
        >
          <div>Card Not Found</div>
          <div style={{ fontSize: 24, marginTop: 20, color: 'white' }}>
            The Executive Jokester
          </div>
        </div>
      ),
      { ...size }
    );
  }

  const persona = personas.find(p => p.id === cardData.personaId) || personas[0];
  const cardProps = { ...cardData, persona };

  const spaceGroteskRegular = fetch(
    new URL('https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQtsPcpFJQ1BqA1gBt2s_3mmx924.woff2', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const robotoCondensedRegular = fetch(
    new URL('https://fonts.gstatic.com/s/robotocondensed/v27/ieVl2ZhZI2eCN5imMyqadqzA_J underwriters.woff2', import.meta.url)
  ).then((res) => res.arrayBuffer());
  
  const blackOpsOneRegular = fetch(
    new URL('https://fonts.gstatic.com/s/blackopsone/v20/qWcsB6-ypo7xBdr6qr86xLoa-9f94g.woff2', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const orbitronRegular = fetch(
    new URL('https://fonts.gstatic.com/s/orbitron/v32/yMJRMIlzdpvBhQQL_Qq7dy0.woff2', import.meta.url)
  ).then((res) => res.arrayBuffer());


  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontFamily: '"Roboto Condensed"',
        }}
      >
        <SharingCard {...cardProps} />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Space Grotesk',
          data: await spaceGroteskRegular,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Roboto Condensed',
          data: await robotoCondensedRegular,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Black Ops One',
          data: await blackOpsOneRegular,
          style: 'normal',
          weight: 400,
        },
        {
            name: 'Orbitron',
            data: await orbitronRegular,
            style: 'normal',
            weight: 400,
        }
      ],
    }
  );
}
