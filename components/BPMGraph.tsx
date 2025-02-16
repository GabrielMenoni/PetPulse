import React from 'react';
import { View, Text } from 'react-native';
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart';
import { colors } from '../styles/colors';

const LineChartComponent = ({ data }) => {
  if (!data || data.length !== 30) {
    //Retorna os 10 ultimos valores do array
    data = data.slice(-10);
  }

  // Formatar os dados para o gráfico
  const formattedData = data.map((value, index) => ({ x: index + 1, y: value }));

  return (
    <View style={{ padding: 5, paddingBottom: 20, backgroundColor: colors.white, borderRadius: 20 }}>
        {/* Título do gráfico */}
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
            Batimento Cardíaco
        </Text>
      <Chart
        style={{ height: 200, width: '100%'}}
        data={formattedData}
        xDomain={{ min: 1, max: 30 }}
        yDomain={{ min: 30, max: Math.max(...data) + 20 }}
        padding={{ left: 40, right: 20, top: 20, bottom: 20 }}
      >
        <VerticalAxis tickCount={5} theme={{ labels: { formatter: v => v.toFixed(0) } }} />
        <HorizontalAxis tickCount={10} theme={{ labels: { formatter: v => v.toFixed(0) } }} />
        <Area theme={{ gradient: { from: { color: colors.green }, to: { color: colors['light-green'], opacity: 0.5 } } }} />
        <Line theme={{ stroke: { color: colors.blue, width: 2 } }} />
      </Chart>
    </View>
  );
};

export default LineChartComponent;
