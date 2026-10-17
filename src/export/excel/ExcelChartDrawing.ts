import type { ExcelTableData } from './ExcelData';

/** 셀 차트를 DrawingML 벡터 도형으로 구성한다. 별도 이미지·차트 라이브러리는 필요하지 않다. */
export function createChartDrawing(
  data: ExcelTableData,
  color: (value: string | undefined, fallback: string) => string,
  xml: (value: string) => string,
  headerCount = 1,
): string | undefined {
  const anchors: string[] = [];
  let id = 1;
  const rgb = (value: string | undefined, fallback = 'FF222222') => color(value, fallback).slice(2);
  const integer = (value: number) => Math.round(value);
  data.cellCharts?.forEach((charts, row) =>
    charts.forEach((chart, column) => {
      if (!chart || !data.columns[column]) return;
      const width = Math.max(12, data.columns[column].width ?? 100);
      const height = Math.max(12, data.rowHeight ?? 26);
      const w = width - 8,
        h = height - 8;
      const shapes: string[] = [];
      const transform = (x: number, y: number, cx: number, cy: number) =>
        `<a:xfrm><a:off x="${integer(x)}" y="${integer(y)}"/><a:ext cx="${Math.max(1, integer(cx))}" cy="${Math.max(
          1,
          integer(cy),
        )}"/></a:xfrm>`;
      const shape = (geometry: string, x: number, y: number, cx: number, cy: number, fill: string) => {
        shapes.push(
          `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${id++}" name="${geometry} ${id}"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>${transform(
            x,
            y,
            cx,
            cy,
          )}<a:prstGeom prst="${geometry}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}"/></a:solidFill><a:ln><a:noFill/></a:ln></xdr:spPr></xdr:sp>`,
        );
      };
      if (chart.type === 'bar') {
        if (![chart.value, chart.minimum, chart.maximum].every(Number.isFinite)) return;
        const min = Math.min(chart.minimum, chart.maximum),
          max = Math.max(chart.minimum, chart.maximum);
        const range = max - min || 1;
        const value = Math.max(min, Math.min(max, chart.value));
        const zero = min < 0 && max > 0 ? (-min / range) * w : min >= 0 ? 0 : w;
        const extent =
          min < 0 && max > 0
            ? (Math.abs(value) / range) * w
            : min >= 0
            ? ((value - min) / range) * w
            : (Math.abs(value - max) / range) * w;
        if (extent > 0)
          shape('rect', 4 + zero - ((min < 0 && value < 0) || max <= 0 ? extent : 0), 4, extent, h, rgb(chart.color));
        const textColor = rgb(data.cellTextColors?.[row]?.[column]);
        shapes.push(
          `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${id++}" name="Bar label"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr>${transform(
            0,
            0,
            width,
            height,
          )}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></xdr:spPr><xdr:txBody><a:bodyPr wrap="none" anchor="ctr" lIns="0" rIns="0" tIns="0" bIns="0"/><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="ko-KR" sz="900"><a:solidFill><a:srgbClr val="${textColor}"/></a:solidFill><a:latin typeface="Calibri"/></a:rPr><a:t>${xml(
            chart.label,
          )}</a:t></a:r><a:endParaRPr lang="ko-KR"/></a:p></xdr:txBody></xdr:sp>`,
        );
      } else {
        const values = chart.values;
        if (!values.length || !values.every(Number.isFinite)) return;
        let min = Infinity,
          max = -Infinity;
        for (const value of values) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
        const range = max - min || 1;
        const pointColor = (value: number, index: number) =>
          value === max
            ? '28A745'
            : value === min
            ? 'DC3545'
            : index === 0 || index === values.length - 1
            ? '0000FF'
            : 'FF9900';
        if (chart.type === 'sparklineBar') {
          const step = w / values.length;
          values.forEach((value, index) => {
            const barHeight = ((value - min) / range) * h;
            if (barHeight > 0)
              shape(
                'rect',
                4 + index * step + Math.min(1, step / 4),
                4 + h - barHeight,
                Math.max(0.5, step - 2),
                barHeight,
                pointColor(value, index),
              );
          });
        } else {
          const points = values.map((value, index) => ({
            x: 4 + (values.length > 1 ? (index / (values.length - 1)) * w : w / 2),
            y: 4 + (1 - (value - min) / range) * h,
          }));
          const path = points
            .map(
              (point, index) =>
                `<a:${index ? 'lnTo' : 'moveTo'}><a:pt x="${integer(point.x)}" y="${integer(point.y)}"/></a:${
                  index ? 'lnTo' : 'moveTo'
                }>`,
            )
            .join('');
          shapes.push(
            `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${id++}" name="Sparkline"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>${transform(
              0,
              0,
              width,
              height,
            )}<a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="0" t="0" r="r" b="b"/><a:pathLst><a:path w="${integer(
              width,
            )}" h="${integer(
              height,
            )}" fill="none">${path}</a:path></a:pathLst></a:custGeom><a:noFill/><a:ln w="7144"><a:solidFill><a:srgbClr val="007ACC"/></a:solidFill></a:ln></xdr:spPr></xdr:sp>`,
          );
          points.forEach((point, index) =>
            shape('ellipse', point.x - 1.875, point.y - 1.875, 3.75, 3.75, pointColor(values[index], index)),
          );
        }
      }
      if (!shapes.length) return;
      anchors.push(
        `<xdr:twoCellAnchor editAs="oneCell"><xdr:from><xdr:col>${column}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${
          row + headerCount
        }</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${
          column + 1
        }</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${
          row + headerCount + 1
        }</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:grpSp><xdr:nvGrpSpPr><xdr:cNvPr id="${id++}" name="Cell chart ${
          row + headerCount + 1
        }-${
          column + 1
        }"/><xdr:cNvGrpSpPr/></xdr:nvGrpSpPr><xdr:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${integer(
          width * 9525,
        )}" cy="${integer(height * 9525)}"/><a:chOff x="0" y="0"/><a:chExt cx="${integer(width)}" cy="${integer(
          height,
        )}"/></a:xfrm></xdr:grpSpPr>${shapes.join('')}</xdr:grpSp><xdr:clientData/></xdr:twoCellAnchor>`,
      );
    }),
  );
  return anchors.length
    ? `<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">${anchors.join(
        '',
      )}</xdr:wsDr>`
    : undefined;
}
