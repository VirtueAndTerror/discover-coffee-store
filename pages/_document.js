import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel='preload'
            href='/fonts/NanumGothic-Bold.ttf'
            as='font'
            crossOrigin='anonymous'
          />
          <link
            rel='preload'
            href='/fonts/NanumGothic-Regular.ttf'
            as='font'
            crossOrigin='anonymous'
          />
          <link
            rel='preload'
            href='/fonts/NanumGothic-ExtraBold.ttf'
            as='font'
            crossOrigin='anonymous'
          />
        </Head>
        <body>
          <Main></Main>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
