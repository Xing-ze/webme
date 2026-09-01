// 核心
import * as echarts from 'echarts/core'
// 渲染器（仅 Canvas）
import { CanvasRenderer } from 'echarts/renderers'
// 图表类型
import { HeatmapChart, PieChart, BarChart } from 'echarts/charts'
// 通用组件
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  GraphicComponent,
} from 'echarts/components'

echarts.use([
  CanvasRenderer,
  HeatmapChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  GraphicComponent,
])

export default echarts
