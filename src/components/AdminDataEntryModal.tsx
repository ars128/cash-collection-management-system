
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useToast } from "@/hooks/use-toast";

interface AdminDataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdate: () => void;
}

export const AdminDataEntryModal = ({ isOpen, onClose, onDataUpdate }: AdminDataEntryModalProps) => {
  const { employees, addTransaction } = useEmployeeData();
  const { toast } = useToast();
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [collectionAmount, setCollectionAmount] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployeeId) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive"
      });
      return;
    }

    const collection = parseFloat(collectionAmount) || 0;
    const deposit = parseFloat(depositAmount) || 0;

    if (collection === 0 && deposit === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one amount (collection or deposit)",
        variant: "destructive"
      });
      return;
    }

    addTransaction(selectedEmployeeId, {
      date: format(selectedDate, 'yyyy-MM-dd'),
      collection,
      deposit
    });

    toast({
      title: "Success",
      description: "Transaction added successfully",
    });

    // Reset form
    setSelectedEmployeeId('');
    setCollectionAmount('');
    setDepositAmount('');
    setSelectedDate(new Date());
    
    onDataUpdate();
  };

  const handleClose = () => {
    setSelectedEmployeeId('');
    setCollectionAmount('');
    setDepositAmount('');
    setSelectedDate(new Date());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">Insert Employee Data</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="employee" className="text-sm font-medium text-slate-700">
              Select Employee
            </Label>
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} (ID: {employee.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-slate-700">
              Transaction Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collection" className="text-sm font-medium text-slate-700">
                MM Collection Amount (₹)
              </Label>
              <Input
                id="collection"
                type="number"
                placeholder="0.00"
                value={collectionAmount}
                onChange={(e) => setCollectionAmount(e.target.value)}
                className="text-right"
                step="0.01"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit" className="text-sm font-medium text-slate-700">
                Deposit Amount (₹)
              </Label>
              <Input
                id="deposit"
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="text-right"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
