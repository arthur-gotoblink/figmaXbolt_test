import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Type, LogOut, User } from 'lucide-react';
import { useSettings } from './SettingsContext';

interface SettingsMenuProps {
  username: string;
  onLogout: () => void;
}

export function SettingsMenu({ username, onLogout }: SettingsMenuProps) {
  const { textSize, setTextSize, getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    onLogout();
    // The sheet will close automatically when the parent component unmounts
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-1 h-auto">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">User settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className={textClasses.heading}>{username}</SheetTitle>
              <SheetDescription className={textClasses.small}>
                Account settings and preferences
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <Label className={textClasses.base}>Text Size</Label>
            </div>
            
            <RadioGroup value={textSize} onValueChange={setTextSize} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="text-sm cursor-pointer">
                  Normal - Standard view
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="text-base cursor-pointer">
                  Large - Easier reading
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="extra-large" id="extra-large" />
                <Label htmlFor="extra-large" className="text-lg cursor-pointer">
                  Extra Large - Maximum readability
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-4 border-t">
            <p className={`${textClasses.small} text-slate-600 mb-4`}>
              Text size setting will be saved and applied across the application.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className={`${textClasses.base} w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50`}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}