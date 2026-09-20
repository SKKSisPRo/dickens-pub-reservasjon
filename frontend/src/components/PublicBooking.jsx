import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import StepProgress from './StepProgress';
import Step1Guests from './Step1Guests';
import Step2Date from './Step2Date';
import Step3Time from './Step3Time';
import Step4Table from './Step4Table';
import Step5Details from './Step5Details';

const WEEKDAY_SHORT = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
const MONTH_SHORT = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];

function formatShortDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAY_SHORT[date.getDay()]} ${d}. ${MONTH_SHORT[m - 1]}`;
}

function PublicBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('19:00');
  const [selectedTable, setSelectedTable] = useState(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+47');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const goNext = () => setCurrentStep(s => Math.min(5, s + 1));
  const goBack = () => setCurrentStep(s => Math.max(1, s - 1));

  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'firstName': setFirstName(value); break;
      case 'lastName': setLastName(value); break;
      case 'phone': setPhone(value); break;
      case 'countryCode': setCountryCode(value); break;
      case 'additionalInfo': setAdditionalInfo(value); break;
      default: break;
    }
  };

  const steps = [
    { id: 1, placeholder: 'Antall personer', value: currentStep > 1 ? `${guests} personer` : null },
    { id: 2, placeholder: 'Velg dato', value: currentStep > 2 ? formatShortDate(date) : null },
    { id: 3, placeholder: 'Velg tid', value: currentStep > 3 ? time : null },
    { id: 4, placeholder: 'Velg bord', value: currentStep > 4 && selectedTable ? `Bord ${selectedTable.name}` : null },
    { id: 5, placeholder: 'Dine detaljer', value: null },
  ];

  return (
    <div className={`flex flex-col ${isSuccess ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Header />

      <main className="flex-grow p-4 md:p-8 flex flex-col items-center">
        {!isSuccess && (
          <StepProgress
            currentStep={currentStep}
            steps={steps}
            onStepClick={setCurrentStep}
          />
        )}

        <div className="w-full max-w-6xl flex-grow flex flex-col">
          {currentStep === 1 && (
            <Step1Guests
              guests={guests}
              onSelect={(val) => { setGuests(val); goNext(); }}
            />
          )}

          {currentStep === 2 && (
            <Step2Date
              onSelect={(d) => { setDate(d); goNext(); }}
              onBack={goBack}
            />
          )}

          {currentStep === 3 && (
            <Step3Time
              date={date}
              time={time}
              onSelect={(t) => { setTime(t); goNext(); }}
              onBack={goBack}
            />
          )}

          {currentStep === 4 && (
            <Step4Table
              date={date}
              time={time}
              guests={guests}
              selectedTable={selectedTable}
              onSelect={(table) => { setSelectedTable(table); goNext(); }}
              onBack={goBack}
            />
          )}

          {currentStep === 5 && (
            <Step5Details
              date={date}
              time={time}
              guests={guests}
              selectedTable={selectedTable}
              firstName={firstName}
              lastName={lastName}
              phone={phone}
              countryCode={countryCode}
              additionalInfo={additionalInfo}
              onFieldChange={handleFieldChange}
              onBack={goBack}
              onSuccess={() => setIsSuccess(true)}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PublicBooking;
