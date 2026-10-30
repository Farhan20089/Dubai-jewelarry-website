import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, CurrencyConfig } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../services/storage';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  AED: {
    code: 'AED',
    symbol: 'AED',
    label: 'AED - UAE Dirham',
    rateAgainstAED: 1.0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'USD - US Dollar',
    rateAgainstAED: 0.2723,
  },
  PKR: {
    code: 'PKR',
    symbol: 'Rs',
    label: 'PKR - Pakistani Rupee',
    rateAgainstAED: 76.50,
  },
};

interface CurrencyContextType {
  currentCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInAED: number, options?: { showCode?: boolean; decimals?: number }) => string;
  convertPrice: (amountInAED: number) => number;
  currencyConfig: CurrencyConfig;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyCode>(() => {
    return getStorageItem<CurrencyCode>(STORAGE_KEYS.CURRENCY, 'AED');
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CURRENCY, currentCurrency);
  }, [currentCurrency]);

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrentCurrencyState(code);
    }
  };

  const currencyConfig = CURRENCIES[currentCurrency] || CURRENCIES.AED;

  const convertPrice = (amountInAED: number): number => {
    return amountInAED * currencyConfig.rateAgainstAED;
  };

  const formatPrice = (
    amountInAED: number,
    options?: { showCode?: boolean; decimals?: number }
  ): string => {
    const decimals = options?.decimals ?? (currentCurrency === 'PKR' ? 0 : 2);
    const converted = convertPrice(amountInAED);
    const formattedNum = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(converted);

    if (options?.showCode === false) {
      return `${currencyConfig.symbol} ${formattedNum}`;
    }

    if (currentCurrency === 'AED') {
      return `AED ${formattedNum}`;
    } else if (currentCurrency === 'USD') {
      return `$${formattedNum} USD`;
    } else {
      return `Rs ${formattedNum} PKR`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency,
        formatPrice,
        convertPrice,
        currencyConfig,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
