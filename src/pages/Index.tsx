import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Bold, Italic, Copy } from "lucide-react";
import { HexColorPicker } from "react-colorful";

const PRESET_COLORS = [
  "FF0000", "00FF00", "0000FF", "FFD700", "FF00FF", "00FFFF",
  "800080", "FFA500", "00FFAA", "A52A2A", "FFFFFF", "000000",
  "FF1493", "00CED1", "FF6347", "32CD32", "9370DB", "F0E68C"
];

const Index = () => {
  const [bioText, setBioText] = useState("");
  const [longBioText, setLongBioText] = useState("");
  const [colorCode, setColorCode] = useState("#FF00FF");
  const [hexInput, setHexInput] = useState("FF00FF");

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setBioText(value);
    }
  };

  const insertFormatting = (tag: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = 
      bioText.substring(0, start) + 
      tag + 
      bioText.substring(end);
    
    if (newText.length <= 50) {
      setBioText(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    } else {
      toast({
        title: "Character limit exceeded",
        description: "Your bio cannot exceed 50 characters.",
        variant: "destructive",
      });
    }
  };

  const handleBold = () => insertFormatting("[b]");
  const handleItalic = () => insertFormatting("[i]");
  
  const handleColorChange = (color: string) => {
    setColorCode(color);
    const hex = color.replace("#", "").toUpperCase();
    setHexInput(hex);
  };

  const handleHexInputChange = (value: string) => {
    const hex = value.toUpperCase().replace(/[^0-9A-F]/g, "");
    setHexInput(hex);
    if (hex.length === 6) {
      setColorCode(`#${hex}`);
    }
  };

  const applyColor = () => {
    if (!hexInput.match(/^[0-9A-Fa-f]{6}$/)) {
      toast({
        title: "Invalid color code",
        description: "Please enter a valid 6-digit hex color code (e.g., FF00FF).",
        variant: "destructive",
      });
      return;
    }
    insertFormatting(`[${hexInput}]`);
  };

  const handleSwatchClick = (hex: string) => {
    setHexInput(hex);
    setColorCode(`#${hex}`);
    insertFormatting(`[${hex}]`);
  };

  const getLastColorCode = () => {
    const matches = bioText.match(/\[([0-9A-Fa-f]{6})\]/g);
    if (matches && matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      return lastMatch.replace(/[\[\]]/g, "");
    }
    return null;
  };

  const renderPreview = (text: string) => {
    let result: JSX.Element[] = [];
    let currentBold = false;
    let currentItalic = false;
    let currentColor = 'hsl(var(--foreground))';
    let textBuffer = '';
    let key = 0;

    const flushBuffer = () => {
      if (textBuffer) {
        result.push(
          <span
            key={key++}
            style={{ 
              color: currentColor,
              fontWeight: currentBold ? 'bold' : 'normal',
              fontStyle: currentItalic ? 'italic' : 'normal'
            }}
          >
            {textBuffer}
          </span>
        );
        textBuffer = '';
      }
    };

    let i = 0;
    while (i < text.length) {
      // Check for [b] tag
      if (text.substr(i, 3) === '[b]') {
        flushBuffer();
        currentBold = true;
        i += 3;
        continue;
      }
      
      // Check for [i] tag
      if (text.substr(i, 3) === '[i]') {
        flushBuffer();
        currentItalic = true;
        i += 3;
        continue;
      }
      
      // Check for color tag [HEXCODE]
      const colorMatch = text.substr(i).match(/^\[([0-9A-Fa-f]{6})\]/);
      if (colorMatch) {
        flushBuffer();
        currentColor = `#${colorMatch[1]}`;
        i += colorMatch[0].length;
        continue;
      }
      
      // Regular character
      textBuffer += text[i];
      i++;
    }
    
    flushBuffer();
    return result.length > 0 ? result : <span className="text-muted-foreground italic">Preview will appear here...</span>;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bioText);
      toast({
        title: "Copied!",
        description: "Bio copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary">
      {/* Animated background mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Main heading */}
        <h1 className="font-outfit font-black text-7xl md:text-9xl text-foreground mb-4 text-glow animate-fade-in" style={{ textShadow: '0 0 40px hsla(190, 100%, 60%, 0.9), 0 0 80px hsla(190, 100%, 60%, 0.5)' }}>
          ꕶʜᴀꜱʜᴡꫝᴛ
        </h1>
        
        <p className="font-inter text-lg md:text-xl mb-16 animate-fade-in" style={{ 
          color: '#FF69B4',
          textShadow: '0 0 20px hsla(330, 100%, 71%, 0.8), 0 0 40px hsla(330, 100%, 71%, 0.4)',
          animationDelay: '0.2s'
        }}>
          UID : 1894004342
        </p>

        {/* Main card */}
        <div className="w-full max-w-2xl glass-card rounded-3xl p-8 md:p-12 space-y-8 transition-all duration-500 hover:scale-[1.02]">
          
          {/* 1. COLOR PICKER SECTION */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Color Picker
            </label>
            
            <div className="glass-card rounded-3xl p-6 space-y-4">
              {/* Circular Color Picker */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="rounded-full overflow-hidden border-2 border-primary/30 shadow-lg hover:border-primary/60 transition-all duration-300" style={{ boxShadow: '0 0 20px hsla(var(--neon-glow), 0.3)' }}>
                  <HexColorPicker color={colorCode} onChange={handleColorChange} style={{ width: '180px', height: '180px' }} />
                </div>
                
                <div className="flex-1 w-full space-y-4">
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      value={hexInput}
                      onChange={(e) => handleHexInputChange(e.target.value)}
                      placeholder="FF00FF"
                      maxLength={6}
                      className="rounded-2xl bg-input border-border focus:ring-2 focus:ring-primary transition-all duration-300 text-lg font-mono uppercase"
                    />
                    <Button
                      onClick={applyColor}
                      variant="secondary"
                      size="lg"
                      className="rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap px-8"
                    >
                      Apply Color
                    </Button>
                  </div>
                </div>
              </div>

              {/* Preset Color Swatches */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Preset Colors
                </label>
                <div className="grid grid-cols-6 md:grid-cols-9 gap-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleSwatchClick(color)}
                      className="w-full aspect-square rounded-xl border-2 border-border hover:border-primary transition-all duration-300 hover:scale-110 cursor-pointer shadow-md"
                      style={{ 
                        backgroundColor: `#${color}`,
                        boxShadow: `0 4px 12px rgba(${parseInt(color.slice(0,2), 16)}, ${parseInt(color.slice(2,4), 16)}, ${parseInt(color.slice(4,6), 16)}, 0.3)`
                      }}
                      title={`#${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. TEXT FORMATTING SECTION */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Text Formatting
            </label>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleBold}
                variant="secondary"
                size="lg"
                className="rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-300 hover:scale-105 px-6 py-6"
              >
                <Bold className="w-5 h-5 mr-2" />
                Bold
              </Button>
              
              <Button
                onClick={handleItalic}
                variant="secondary"
                size="lg"
                className="rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-300 hover:scale-105 px-6 py-6"
              >
                <Italic className="w-5 h-5 mr-2" />
                Italic
              </Button>
            </div>
          </div>

          {/* 3. YOUR BIO SECTION */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Your Bio (Maximum 50 characters)
            </label>
            <Textarea
              value={bioText}
              onChange={handleTextareaChange}
              placeholder="Write your bio here..."
              className="min-h-[120px] resize-none bg-input border-border text-foreground rounded-2xl focus:ring-2 focus:ring-primary transition-all duration-300 font-inter"
              maxLength={50}
            />
            <div className="flex justify-end">
              <span className={`text-sm ${bioText.length >= 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {bioText.length} / 50
              </span>
            </div>
          </div>

          {/* BIO LIVE PREVIEW */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Live Preview
            </label>
            <div className="min-h-[80px] p-6 rounded-2xl bg-muted border border-border glass-card">
              <div className="font-inter break-words whitespace-pre-wrap">
                {renderPreview(bioText)}
              </div>
            </div>
          </div>

          {/* 4. YOUR LONG BIO SECTION */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Your Long Bio (Maximum 250 characters)
            </label>
            <Textarea
              value={longBioText}
              onChange={(e) => {
                if (e.target.value.length <= 250) {
                  setLongBioText(e.target.value);
                }
              }}
              placeholder="Write your long bio here..."
              className="min-h-[150px] resize-none bg-input border-border text-foreground rounded-2xl focus:ring-2 focus:ring-primary transition-all duration-300 font-inter"
              maxLength={250}
            />
            <div className="flex justify-end">
              <span className={`text-sm ${longBioText.length >= 250 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {longBioText.length} / 250
              </span>
            </div>
          </div>

          {/* LONG BIO LIVE PREVIEW */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Live Preview
            </label>
            <div className="min-h-[100px] p-6 rounded-2xl bg-muted border border-border glass-card">
              <div className="font-inter break-words whitespace-pre-wrap">
                {renderPreview(longBioText)}
              </div>
            </div>
          </div>

          {/* 5. COPY BIO BUTTON */}
          <Button
            onClick={handleCopy}
            disabled={!bioText}
            size="lg"
            className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-7 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            <Copy className="w-5 h-5 mr-2" />
            Copy Bio
          </Button>
        </div>

        {/* Footer text */}
        <p className="mt-12 text-muted-foreground text-sm font-inter">
          Made with modern web technologies
        </p>
      </div>
    </div>
  );
};

export default Index;
