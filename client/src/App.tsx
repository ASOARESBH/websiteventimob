import React from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocationProvider } from "./contexts/LocationContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { FloatingWhatsapp, CookieBanner } from "./components/SupportWidgets";

// Páginas
import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import PropertyDetailPage from "./pages/PropertyDetail";
import {
  BrokersListPage,
  BrokerDetailPage,
  AgenciesListPage,
  AgencyDetailPage,
} from "./pages/BrokersAgencies";
import { ForBrokersPage, BrokerLoginPage } from "./pages/BrokerAuthPages";
import { ForAgenciesPage, PrivacyLgpdPage } from "./pages/InstitutionalPages";
import AdminPage from "./pages/Admin";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/busca" component={SearchPage} />
          <Route path="/imovel/:slug" component={PropertyDetailPage} />
          <Route path="/corretores" component={BrokersListPage} />
          <Route path="/corretor/:slug" component={BrokerDetailPage} />
          <Route path="/imobiliarias" component={AgenciesListPage} />
          <Route path="/imobiliaria/:slug" component={AgencyDetailPage} />
          <Route path="/para-corretores" component={ForBrokersPage} />
          <Route path="/para-imobiliarias" component={ForAgenciesPage} />
          <Route path="/login-corretor" component={BrokerLoginPage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/privacidade-lgpd" component={PrivacyLgpdPage} />
          <Route path="/termos" component={PrivacyLgpdPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
      <FloatingWhatsapp />
      <CookieBanner />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LocationProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LocationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
