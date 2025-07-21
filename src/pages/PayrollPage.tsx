const PayrollPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
        <p className="text-muted-foreground">
          Manage payroll processing and employee compensation
        </p>
      </div>
      
      <div className="bg-gradient-card p-8 rounded-lg shadow-card text-center">
        <h2 className="text-xl font-semibold text-foreground mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">
          Payroll management features are being developed
        </p>
      </div>
    </div>
  );
};

export default PayrollPage;