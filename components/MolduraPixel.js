import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

export default function MolduraPixel({
  corFundo,
  corTopo,
  pixel = 4,
  degraus = 2,
  style,
  children,
}) {
  const niveis = Array.from({ length: degraus + 1 }, (_, nivel) => nivel);
  const intermediarios = niveis.slice(1, -1);

  return (
    <View style={style}>
      {niveis.map((nivel) => (
        <View
          key={`camada-${nivel}`}
          style={[
            styles.camada,
            {
              backgroundColor: corFundo,
              top: (degraus - nivel) * pixel,
              bottom: (degraus - nivel) * pixel,
              left: nivel * pixel,
              right: nivel * pixel,
            },
          ]}
        />
      ))}

      {corTopo ? (
        <>
          <View
            style={[
              styles.camada,
              {
                backgroundColor: corTopo,
                top: 0,
                height: pixel,
                left: degraus * pixel,
                right: degraus * pixel,
              },
            ]}
          />
          {intermediarios.map((nivel) => {
            const degrau = {
              backgroundColor: corTopo,
              top: (degraus - nivel) * pixel,
              width: pixel,
              height: pixel,
            };

            return (
              <Fragment key={`topo-${nivel}`}>
                <View style={[styles.camada, degrau, { left: nivel * pixel }]} />
                <View style={[styles.camada, degrau, { right: nivel * pixel }]} />
              </Fragment>
            );
          })}
        </>
      ) : null}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  camada: {
    position: 'absolute',
  },
});
