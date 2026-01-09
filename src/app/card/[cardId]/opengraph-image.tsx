
import { ImageResponse } from 'next/og';
import SharingCard from '@/components/sharing-card';
import { personas } from '@/lib/personas';
import type { Persona } from '@/lib/types';

export const runtime = 'edge';

export const alt = 'The Executive Jokester';
export const size = {
  width: 400,
  height: 500,
};
export const contentType = 'image/png';

export default async function Image({ params, searchParams }: { params: { cardId: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  
  const name = searchParams.name as string || 'Not Found';
  const personaId = searchParams.personaId as string;
  const satiricalWit = searchParams.satiricalWit as string || 'The Executive Jokester';
  const imageUrl = searchParams.imageUrl as string;
  const isEvolved = searchParams.isEvolved === 'true';
  const customQuote = searchParams.customQuote as string || '';


  const persona = personas.find(p => p.id === personaId);

  if (!persona) {
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

  const cardProps = {
    name,
    persona,
    imageUrl,
    satiricalWit,
    theme: 'Tactical', // Assuming a default or pass if needed
    isEvolved,
    customQuote,
  };

  const spaceGroteskRegular = fetch(
    'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQtsPcpFJQ1BqA1gBt2s_3mmx924.woff2'
  ).then((res) => res.arrayBuffer());

  const robotoCondensedRegular = fetch(
    'https://fonts.gstatic.com/s/robotocondensed/v27/ieVl2ZhZI2eCN5imMyqadqzA_J underwriters.woff2'
  ).then((res) => res.arrayBuffer());
  
  const blackOpsOneRegular = fetch(
    'https://fonts.gstatic.com/s/blackopsone/v20/qWcsB6-ypo7xBdr6qr86xLoa-9f94g.woff2'
  ).then((res) => res.arrayBuffer());

  const orbitronRegular = fetch(
    'https://fonts.gstatic.com/s/orbitron/v32/yMJRMIlzdpvBhQQL_Qq7dy0.woff2'
  ).then((res) => res.arrayBuffer());


  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontFamily: '"Roboto Condensed"',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* @ts-ignore */}
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
