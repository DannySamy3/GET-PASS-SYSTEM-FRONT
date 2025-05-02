"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

// Chart config context
type ChartConfig = Record<
  string,
  {
    color?: string;
    label?: string;
  }
>;

const ChartConfigContext = React.createContext<ChartConfig | null>(null);

function useChartConfig() {
  const context = React.useContext(ChartConfigContext);
  if (!context) {
    throw new Error("useChartConfig must be used within a ChartConfigProvider");
  }
  return context;
}

// Chart container
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  // Create CSS variables for colors
  const style = React.useMemo(() => {
    return Object.entries(config).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value.color) {
          acc[`--color-${key}`] = value.color;
        }
        return acc;
      },
      {}
    );
  }, [config]);

  return (
    <ChartConfigContext.Provider value={config}>
      <div className={cn("h-full w-full", className)} style={style} {...props}>
        {children}
      </div>
    </ChartConfigContext.Provider>
  );
}

// Chart tooltip content component
interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<any>;
  label?: string;
  formatter?: (value: any) => React.ReactNode;
  labelKey?: string;
  hideLabel?: boolean;
}

function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
  labelKey,
  hideLabel = false,
}: ChartTooltipContentProps) {
  const config = useChartConfig();

  if (!active || !payload?.length) {
    return null;
  }

  const labelValue = labelKey ? config[labelKey]?.label : label;

  return (
    <div className='flex flex-col gap-1 rounded-md border bg-background p-2 text-sm shadow-sm'>
      {!hideLabel && labelValue ? (
        <div className='font-medium'>{labelValue}</div>
      ) : null}
      <div className='flex flex-col gap-0.5'>
        {payload.map((item: any, index: number) => {
          const dataKey = item.dataKey;
          const itemConfig = config[dataKey];
          const itemName = itemConfig?.label || dataKey;
          const itemColor = itemConfig?.color || `var(--color-${dataKey})`;
          const itemValue = formatter ? formatter(item.value) : item.value;

          return (
            <div key={index} className='flex items-center gap-1'>
              <Circle
                className='size-2 shrink-0'
                style={{
                  fill: itemColor,
                  color: itemColor,
                }}
              />
              <span className='text-muted-foreground'>{itemName}:</span>
              <span className='font-medium'>{itemValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Chart legend
interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
}

function ChartLegend({
  className,
  direction = "row",
  ...props
}: ChartLegendProps) {
  const config = useChartConfig();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4",
        direction === "column" && "flex-col items-start",
        className
      )}
      {...props}
    >
      {Object.entries(config).map(([key, value]) => {
        if (!value.label) return null;

        return (
          <div key={key} className='flex items-center gap-1'>
            <div
              className='size-2 rounded-full'
              style={{
                backgroundColor: value.color || `var(--color-${key})`,
              }}
            />
            <span className='text-sm text-muted-foreground'>{value.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Chart value
interface ChartValueProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  label?: string;
  indicator?: "up" | "down" | "unchanged";
}

function ChartValue({
  value,
  label,
  indicator,
  className,
  ...props
}: ChartValueProps) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <div className='flex items-center gap-1'>
        {indicator ? (
          indicator === "up" ? (
            <ChevronUp className='size-3 text-emerald-500' />
          ) : indicator === "down" ? (
            <ChevronDown className='size-3 text-red-500' />
          ) : null
        ) : null}
        <span className='text-2xl font-bold'>{value}</span>
      </div>
      {label ? (
        <span className='text-sm text-muted-foreground'>{label}</span>
      ) : null}
    </div>
  );
}

export {
  ChartContainer,
  ChartLegend,
  ChartTooltipContent,
  ChartValue,
  useChartConfig,
};
