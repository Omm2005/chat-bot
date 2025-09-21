// 'use client';

// import * as React from 'react';
// import {
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   Calendar,
//   BarChart3,
//   Volume2,
// } from 'lucide-react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';
// import type { StockData } from '@/lib/ai/tools/getStock';

// export interface StockProps {
//   stockData: StockData | null | undefined;
//   isLoading?: boolean;
// }

// export default function Stock({ stockData, isLoading = false }: StockProps) {
//   if (isLoading) {
//     return (
//       <Card className="w-full">
//         <CardHeader>
//           <Skeleton className="h-5 w-24" />
//           <Skeleton className="h-4 w-40" />
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <Skeleton className="h-10 w-32" />
//           <Skeleton className="h-6 w-24" />
//           <div className="grid grid-cols-2 gap-3">
//             <Skeleton className="h-16 w-full" />
//             <Skeleton className="h-16 w-full" />
//             <Skeleton className="h-16 w-full" />
//             <Skeleton className="h-16 w-full" />
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!stockData) {
//     return (
//       <Card className="w-full">
//         <CardHeader>
//           <CardTitle className="text-base">No stock data</CardTitle>
//           <CardDescription>Try another symbol or refresh.</CardDescription>
//         </CardHeader>
//       </Card>
//     );
//   }

//   const isPositive = stockData.change >= 0;
//   const Icon = isPositive ? TrendingUp : TrendingDown;

//   const fmt = {
//     price: (n: number) => n.toFixed(2),
//     change: (n: number) => (n >= 0 ? `+${n.toFixed(2)}` : n.toFixed(2)),
//     pct: (n: number) => (n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`),
//     vol: (n: number) =>
//       n >= 1_000_000_000
//         ? `${(n / 1_000_000_000).toFixed(1)}B`
//         : n >= 1_000_000
//           ? `${(n / 1_000_000).toFixed(1)}M`
//           : n >= 1_000
//             ? `${(n / 1_000).toFixed(1)}K`
//             : String(n),
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader className="flex flex-row items-start justify-between space-y-0">
//         <div className="flex items-center gap-3">
//           <div className="grid size-10 place-items-center rounded-md bg-primary/10">
//             <DollarSign className="size-5 text-primary" />
//           </div>
//           <div>
//             <CardTitle className="text-lg">{stockData.symbol}</CardTitle>
//             <CardDescription className="truncate">
//               {stockData.name}
//             </CardDescription>
//           </div>
//         </div>
//         <div className="text-muted-foreground text-xs">
//           <div>Last updated</div>
//           <div>{new Date(stockData.lastUpdated).toLocaleDateString()}</div>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         {/* Price row */}
//         <div className="flex items-end gap-3">
//           <div className="font-semibold text-3xl">
//             ${fmt.price(stockData.price)}
//           </div>
//           <Badge
//             variant="secondary"
//             className={
//               isPositive
//                 ? 'border border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-400'
//                 : 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400'
//             }
//           >
//             <span className="inline-flex items-center gap-1">
//               <Icon className="size-4" />
//               {fmt.change(stockData.change)} ({fmt.pct(stockData.changePercent)}
//               )
//             </span>
//           </Badge>
//         </div>

//         {/* Mini grid of key metrics */}
//         <div className="grid grid-cols-2 gap-3">
//           <Metric
//             icon={<BarChart3 className="size-4 text-muted-foreground" />}
//             label="Day Range"
//             value={`$${fmt.price(stockData.low)} – $${fmt.price(stockData.high)}`}
//           />
//           <Metric
//             icon={<Volume2 className="size-4 text-muted-foreground" />}
//             label="Volume"
//             value={fmt.vol(stockData.volume)}
//           />
//           <Metric
//             icon={<Calendar className="size-4 text-muted-foreground" />}
//             label="Open"
//             value={`$${fmt.price(stockData.open)}`}
//           />
//           <Metric
//             icon={<DollarSign className="size-4 text-muted-foreground" />}
//             label="Prev Close"
//             value={`$${fmt.price(stockData.previousClose)}`}
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// /** simple subcomponent for a labeled value */
// function Metric({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string | number;
// }) {
//   return (
//     <div className="rounded-lg border bg-card p-3">
//       <div className="mb-1 flex items-center gap-2 text-muted-foreground text-xs">
//         {icon}
//         <span>{label}</span>
//       </div>
//       <div className="font-medium text-sm">{value}</div>
//     </div>
//   );
// }
