export function parseToNumber(value) {
  if (value === undefined || value === null || value === "") return 0;

  if (typeof value === 'number') return value;

  const cleanValue = value
    .toString()
    .replace(/[^0-9,.-]+/g, "")
    .trim();

  if (cleanValue.includes(',')) {
    return parseFloat(cleanValue.replace(/\./g, "").replace(',', '.'));
  }
  return parseFloat(cleanValue) || 0;
}

export function formatCurrency(value, context = 'display') {
  if (value === '' && context === 'input') return '';

  const number = parseToNumber(value);

  if (context === 'input') {
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatCurrencyInput(value) {
  if (!value) return '';
  let digits = value.replace(/\D/g, '');

  if (!digits) return '';

  digits = digits.replace(/^0+(?!$)/, '');

  digits = digits.padStart(3, '0');

  const integerPart = digits.slice(0, -2);
  const decimalPart = digits.slice(-2);

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${formattedInteger},${decimalPart}`;
};

export const DROPDOWN_OPTIONS = [
  { value: 200, text: 'Até R$200' },
  { value: 400, text: 'De R$200 até R$400' },
  { value: 600, text: 'De R$400 até R$600' },
  { value: 800, text: 'De R$600 até R$800' },
  { value: 1000, text: 'De R$800 até R$1000' },
  { value: 1500, text: 'De R$1000 até R$1500' },
  { value: 2000, text: 'De R$1500 até R$2000' },
  { value: 3000, text: 'Acima de R$2000' }
];

function calculateSavingsIn10Years(realGenerationKwh, energyRate, estimatedProjectCost) {
  const annualTariffIncrease = 0.08;
  const systemDegradation = 0.007;
  const yearlyData = [];

  let currentRate = energyRate;
  let currentGeneration = realGenerationKwh;
  let totalSavings = 0;
  let cumulativeSavings = 0;

  for (let year = 1; year <= 25; year++) {
    const annualGeneration = currentGeneration * 12;
    const annualSavings = annualGeneration * currentRate;

    totalSavings += annualSavings;
    cumulativeSavings = totalSavings - estimatedProjectCost;

    yearlyData.push({
      year,
      generation: annualGeneration,
      tariff: currentRate,
      savings: annualSavings,
      cumulativeSavings,
      roi: (cumulativeSavings / estimatedProjectCost) * 100
    });

    currentRate *= (1 + annualTariffIncrease);
    currentGeneration *= (1 - systemDegradation);
  }

  const savingsIn10Years = yearlyData
    .filter(data => data.year <= 10)
    .reduce((sum, data) => sum + data.savings, 0);

  let paybackTime = 25;
  const paybackYear = yearlyData.find(data => data.cumulativeSavings >= 0);

  if (paybackYear) {
    if (paybackYear.year === 1) {
      paybackTime = 1;
    } else {
      const previousYear = yearlyData[paybackYear.year - 2];
      const remainingToPayback = Math.abs(previousYear.cumulativeSavings);
      const savingsInPaybackYear = paybackYear.savings;
      const fraction = remainingToPayback / savingsInPaybackYear;
      paybackTime = Number((previousYear.year + fraction).toFixed(1));
    }
  }

  return {
    savingsIn10Years: Number(savingsIn10Years.toFixed(2)),
    paybackTime
  };
}

export function solarCalculator({
  monthlyBill,
  location = "Iguaracy - PE",
  energyRate = 1.03,
  solarIrradiance = 5.3
}) {
  const daysPerMonth = 30;
  const performanceRatio = 0.75;
  const modulePower = 550;
  const modulePowerKw = modulePower / 1000;
  const moduleArea = 2;
  const baseAreaLimit = 35;
  const valorMetroQuadrado = 174;

  let consumptionKwh = Math.ceil(monthlyBill / energyRate);
  if (consumptionKwh < 260) consumptionKwh = 260;

  const requiredKwp = consumptionKwh / (solarIrradiance * daysPerMonth * performanceRatio);
  const modules = Math.ceil(requiredKwp / modulePowerKw);
  const finalPowerKwp = Math.ceil(modules * modulePowerKw * 10) / 10;
  const realGenerationKwh = Math.ceil(finalPowerKwp * solarIrradiance * daysPerMonth * performanceRatio);
  const energySurplus = realGenerationKwh - consumptionKwh;

  const totalAreaRequired = modules * moduleArea;
  const excessArea = totalAreaRequired > baseAreaLimit ? totalAreaRequired - baseAreaLimit : 0;
  const areaAdditionalCost = Math.ceil(excessArea) * valorMetroQuadrado;
  const areaUsedInLots = Number((totalAreaRequired / baseAreaLimit).toFixed(2));

  const estimatedPrice = finalPowerKwp * 2686;
  const estimatedPriceAdditionalCost = estimatedPrice + 6000 + areaAdditionalCost;

  let inverterModel = "";
  if (finalPowerKwp <= 5) inverterModel = "WEG SIW300H M030 Híbrido";
  else if (finalPowerKwp <= 6) inverterModel = "WEG SIW200G M050";
  else if (finalPowerKwp <= 8) inverterModel = "WEG SIW200G M060";
  else if (finalPowerKwp <= 10) inverterModel = "WEG SIW200G M090";
  else if (finalPowerKwp <= 50) inverterModel = "WEG SIW400G K030 - 220V";
  else inverterModel = "WEG SIW400G T075";

  const inverterBrand = "GROWATT";
  const inverterQuantity = 1;

  const interestRate = 0.0156;
  let totalInstallments = 60;

  function calculateInstallment(value, months) {
    return (value * interestRate * Math.pow(1 + interestRate, months)) /
           (Math.pow(1 + interestRate, months) - 1);
  }

  let monthlyInstallment = calculateInstallment(estimatedPriceAdditionalCost, totalInstallments);

  if (monthlyInstallment > monthlyBill) {
    totalInstallments = 72;
    monthlyInstallment = calculateInstallment(estimatedPriceAdditionalCost, totalInstallments);

    if (monthlyInstallment > monthlyBill) {
      totalInstallments = 84;
      monthlyInstallment = calculateInstallment(estimatedPriceAdditionalCost, totalInstallments);
    }
  }

  const financialMetrics = calculateSavingsIn10Years(
    realGenerationKwh,
    energyRate,
    estimatedPriceAdditionalCost

  function applyDiscount(estimatedPriceAdditionalCost, totalAreaRequired) {
  let discount = 2000;  
 
  if (totalAreaRequired > 35) {
    const excessArea = totalAreaRequired - 35;
    const discountPerSquareMeter = 57; 
    discount += excessArea * discountPerSquareMeter; 
  }

  return discount;
}
  );

  const associationFee = Number(((totalAreaRequired / baseAreaLimit) * 24.90).toFixed(2));
  const installment36x = Number(calculateInstallment(estimatedPriceAdditionalCost, 36).toFixed(2));
  const installment48x = Number(calculateInstallment(estimatedPriceAdditionalCost, 48).toFixed(2));

  return {
    monthlyBill: Number(monthlyBill),
    energyRate: Number(energyRate),
    solarIrradiance,
    consumptionKwh,
    requiredKwp: Number(requiredKwp.toFixed(2)),
    modules,
    moduleName: "WEG 550W",
    modulePower: "WEG 550W",
    finalPowerKwp: Number(finalPowerKwp.toFixed(1)),
    realGenerationKwh,
    energySurplus,
    inverterModel,
    inverterQuantity,
    inverterBrand,
    estimatedProjectCost: Number(estimatedPriceAdditionalCost.toFixed(2)),
    monthlyInstallment: Number(monthlyInstallment.toFixed(2)),
    installmentCount: totalInstallments,
    discount,
    totalAreaRequired: Number(totalAreaRequired.toFixed(2)),
    excessArea: Number(excessArea.toFixed(2)),
    valorMetroQuadrado,
    areaUsedInLots,
    savingsIn10Years: financialMetrics.savingsIn10Years,
    paybackTime: financialMetrics.paybackTime,
    associationFee,
    installment36x,
    installment48x
  };
}

