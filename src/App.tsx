import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Fuel,
  TrendingUp,
  TrendingDown,
  Calculator,
  DollarSign,
  Calendar,
  Car,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react";

interface FuelCalculation {
  currentMonthlyLitres: number;
  currentMonthlyCost: number;
  newMonthlyCost: number;
  noSubsidyCost: number;
  savings: number;
  savingsVsNoSubsidy: number;
  newSystemSavingsVsNoSubsidy: number;
  dailyConsumption: number;
  refuelFrequency: number;
  exceedsLimit: boolean;
  subsidizedLitres: number;
  unsubsidizedLitres: number;
}

function App() {
  const [tankSize, setTankSize] = useState<string>("");
  const [monthlyCost, setMonthlyCost] = useState<string>("");

  const CURRENT_PRICE = 2.05;
  const NEW_SUBSIDIZED_PRICE = 1.99;
  const SUBSIDY_LIMIT = 300;
  const UNSUBSIDIZED_PRICE = 2.6; // Price for fuel above 300L limit
  const MARKET_PRICE = 2.6; // Market price without any subsidy

  const calculation = useMemo((): FuelCalculation | null => {
    const tank = parseFloat(tankSize);
    const cost = parseFloat(monthlyCost);

    if (!tank || !cost || tank <= 0 || cost <= 0) return null;

    const currentMonthlyLitres = cost / CURRENT_PRICE;
    const dailyConsumption = currentMonthlyLitres / 30;
    const refuelFrequency = Math.ceil(currentMonthlyLitres / tank);

    // Calculate cost without any subsidy
    const noSubsidyCost = currentMonthlyLitres * MARKET_PRICE;

    let newMonthlyCost: number;
    let subsidizedLitres: number;
    let unsubsidizedLitres: number;
    let exceedsLimit: boolean;

    if (currentMonthlyLitres <= SUBSIDY_LIMIT) {
      newMonthlyCost = currentMonthlyLitres * NEW_SUBSIDIZED_PRICE;
      subsidizedLitres = currentMonthlyLitres;
      unsubsidizedLitres = 0;
      exceedsLimit = false;
    } else {
      subsidizedLitres = SUBSIDY_LIMIT;
      unsubsidizedLitres = currentMonthlyLitres - SUBSIDY_LIMIT;
      newMonthlyCost =
        SUBSIDY_LIMIT * NEW_SUBSIDIZED_PRICE +
        unsubsidizedLitres * UNSUBSIDIZED_PRICE;
      exceedsLimit = true;
    }

    const savings = cost - newMonthlyCost;
    const savingsVsNoSubsidy = noSubsidyCost - cost;
    const newSystemSavingsVsNoSubsidy = noSubsidyCost - newMonthlyCost;

    return {
      currentMonthlyLitres,
      currentMonthlyCost: cost,
      newMonthlyCost,
      noSubsidyCost,
      savings,
      savingsVsNoSubsidy,
      newSystemSavingsVsNoSubsidy,
      dailyConsumption,
      refuelFrequency,
      exceedsLimit,
      subsidizedLitres,
      unsubsidizedLitres,
    };
  }, [tankSize, monthlyCost]);

  const formatCurrency = (amount: number) => `RM ${amount.toFixed(2)}`;
  const formatLitres = (litres: number) => `${litres.toFixed(1)}L`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm mb-4">
            <Fuel className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-800">
              Malaysia Fuel Calculator
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            RON95 Subsidy Impact Calculator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Compare your fuel costs between the current subsidy (RM 2.05/L
            unlimited) and the new targeted subsidy (RM 1.99/L for first 300L
            per month).
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <Card className="lg:col-span-1 shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Your Details
              </CardTitle>
              <CardDescription className="text-blue-100">
                Enter your current fuel consumption details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="tankSize"
                  className="text-sm font-medium text-gray-700"
                >
                  Fuel Tank Capacity (Litres)
                </Label>
                <div className="relative">
                  <Input
                    id="tankSize"
                    type="number"
                    placeholder="e.g., 50"
                    value={tankSize}
                    onChange={(e) => setTankSize(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Car className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="monthlyCost"
                  className="text-sm font-medium text-gray-700"
                >
                  Current Monthly Fuel Spending (RM)
                </Label>
                <div className="relative">
                  <Input
                    id="monthlyCost"
                    type="number"
                    placeholder="e.g., 300"
                    value={monthlyCost}
                    onChange={(e) => setMonthlyCost(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {calculation && (
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily consumption:</span>
                    <span className="font-semibold">
                      {formatLitres(calculation.dailyConsumption)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly consumption:</span>
                    <span className="font-semibold">
                      {formatLitres(calculation.currentMonthlyLitres)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Refuel frequency:</span>
                    <span className="font-semibold">
                      {calculation.refuelFrequency}x/month
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {calculation ? (
              <>
                {/* Main Comparison Card */}
                <Card className="shadow-lg border-0 overflow-hidden">
                  <CardHeader
                    className={`text-white ${
                      calculation.savings >= 0
                        ? "bg-gradient-to-r from-green-600 to-emerald-600"
                        : "bg-gradient-to-r from-red-600 to-pink-600"
                    }`}
                  >
                    <CardTitle className="flex items-center gap-2">
                      {calculation.savings >= 0 ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <AlertTriangle className="h-6 w-6" />
                      )}
                      Cost Impact Analysis
                    </CardTitle>
                    <CardDescription
                      className={
                        calculation.savings >= 0
                          ? "text-green-100"
                          : "text-red-100"
                      }
                    >
                      {calculation.savings >= 0
                        ? "You will save money!"
                        : "Your costs will increase"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">
                          Current System
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(calculation.currentMonthlyCost)}
                        </div>
                        <div className="text-xs text-gray-500">
                          RM 2.05/L unlimited
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        {calculation.savings >= 0 ? (
                          <TrendingDown className="h-8 w-8 text-green-600" />
                        ) : (
                          <TrendingUp className="h-8 w-8 text-red-600" />
                        )}
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">
                          New System
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(calculation.newMonthlyCost)}
                        </div>
                        <div className="text-xs text-gray-500">
                          RM 1.99/L (first 300L), RM {UNSUBSIDIZED_PRICE.toFixed(2)}/L after
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">
                          No Subsidy
                        </div>
                        <div className="text-xl font-bold text-red-700">
                          {formatCurrency(calculation.noSubsidyCost)}
                        </div>
                        <div className="text-xs text-gray-500">
                          RM {MARKET_PRICE.toFixed(2)}/L market price
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${
                          calculation.savings >= 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {calculation.savings >= 0 ? "💰 " : "📈 "}
                        {calculation.savings >= 0 ? "You save " : "You pay "}
                        {formatCurrency(Math.abs(calculation.savings))}
                        {calculation.savings >= 0
                          ? " per month"
                          : " more per month"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* No Subsidy Comparison */}
                <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-50 to-red-50">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6" />
                      Without Subsidy Impact
                    </CardTitle>
                    <CardDescription className="text-orange-100">
                      How much you save compared to market price
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">
                          Current System vs No Subsidy
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                          💰 Save{" "}
                          {formatCurrency(calculation.savingsVsNoSubsidy)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          per month with current subsidy
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">
                          New System vs No Subsidy
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                          💰 Save{" "}
                          {formatCurrency(
                            calculation.newSystemSavingsVsNoSubsidy
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          per month with new subsidy
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Annual Savings vs Market Price
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-3 border">
                          <div className="text-xs text-gray-500">
                            Current System
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            +
                            {formatCurrency(
                              calculation.savingsVsNoSubsidy * 12
                            )}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border">
                          <div className="text-xs text-gray-500">
                            New System
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            +
                            {formatCurrency(
                              calculation.newSystemSavingsVsNoSubsidy * 12
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Consumption Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Subsidized fuel (RM 1.99/L)
                          </span>
                          <Badge variant="secondary">
                            {formatLitres(calculation.subsidizedLitres)}
                          </Badge>
                        </div>
                        <Progress
                          value={
                            (calculation.subsidizedLitres /
                              calculation.currentMonthlyLitres) *
                            100
                          }
                          className="h-2"
                        />

                        {calculation.exceedsLimit && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                Above limit fuel (RM 2.60/L)
                              </span>
                              <Badge variant="destructive">
                                {formatLitres(calculation.unsubsidizedLitres)}
                              </Badge>
                            </div>
                            <Progress
                              value={
                                (calculation.unsubsidizedLitres /
                                  calculation.currentMonthlyLitres) *
                                100
                              }
                              className="h-2"
                            />
                          </>
                        )}

                        <div className="pt-2 text-xs text-gray-500">
                          Subsidy limit: {SUBSIDY_LIMIT}L per month
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Usage Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Daily consumption
                          </span>
                          <span className="font-semibold">
                            {formatLitres(calculation.dailyConsumption)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Refuel frequency
                          </span>
                          <span className="font-semibold">
                            {calculation.refuelFrequency}x per month
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Monthly consumption
                          </span>
                          <span className="font-semibold">
                            {formatLitres(calculation.currentMonthlyLitres)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Yearly savings/cost
                          </span>
                          <span
                            className={`font-semibold ${
                              calculation.savings >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {calculation.savings >= 0 ? "+" : ""}
                            {formatCurrency(calculation.savings * 12)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Alert for high consumers */}
                {calculation.exceedsLimit && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      <strong>High fuel consumption detected:</strong> You
                      consume more than 300L per month. Consider fuel-efficient
                      driving practices or exploring alternative transportation
                      options to maximize your savings under the new subsidy
                      system.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <Card className="shadow-lg border-0 h-96">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <Fuel className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      Ready to Calculate
                    </p>
                    <p className="text-sm">
                      Enter your fuel tank size and monthly spending to see your
                      cost comparison
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <Card className="mt-8 bg-slate-50 border-slate-200">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-slate-900">
                About the Calculation
              </h3>
              <p className="text-sm text-slate-600 max-w-3xl mx-auto leading-relaxed">
                This calculator compares Malaysia's current RON95 subsidy system
                (RM 2.05/L unlimited) with the new targeted subsidy system (RM
                1.99/L for the first 300 litres per month, RM 2.60/L after) and
                shows comparison with market price (RM {MARKET_PRICE.toFixed(2)}
                /L without subsidy).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
