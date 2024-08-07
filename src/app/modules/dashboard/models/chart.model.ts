export interface Chart {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string[];
    hoverBackgroundColor?: string[];
    fill?: boolean;
    borderColor?: string[];
    tension?: number;
  }[];
}

export interface ChartOptions {
  maintainAspectRatio?: boolean;
  aspectRatio: number;
  plugins: {
    legend: {
      labels: {
        color?: string;
        usePointStyle?: boolean;
      };
    };
  };
  scales?: {
    x: {
      ticks: {
        color?: string;
      };
      grid: {
        color?: string;
        drawBorder: boolean;
      };
    };
    y: {
      ticks: {
        color?: string;
      };
      grid: {
        color?: string;
        drawBorder: boolean;
      };
    };
  };
}
