import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Send, Phone, Video, Info, ShoppingBag, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Chat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const productContext = location.state?.product;

    const [messages, setMessages] = useState<{ id: number, text: string, sender: 'me' | 'other', time: string }[]>([
        { id: 1, text: "Hi! Is the Chanel bag still available?", sender: 'other', time: "10:30 AM" },
        { id: 2, text: "Yes, it is! Are you interested in renting or buying?", sender: 'me', time: "10:32 AM" },
        { id: 3, text: "I'm thinking of renting it for the weekend.", sender: 'other', time: "10:35 AM" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderStep, setOrderStep] = useState(1);

    useEffect(() => {
        if (productContext) {
            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    text: `Hi, I'm interested in buying ${productContext.title} for ₹${productContext.price.toLocaleString()}. Is it still available?`,
                    sender: 'me',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    }, [productContext]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, {
            id: messages.length + 1,
            text: inputValue,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setInputValue("");
    };

    const handlePlaceOrder = () => {
        setIsOrderModalOpen(false);
        setShowSuccess(true);

        // Add successful order message
        setMessages(prev => [
            ...prev,
            {
                id: prev.length + 1,
                text: `Order Confirmed! I've placed an order for ${productContext?.title}.`,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
        setOrderStep(1);
    };

    return (
        <main className="min-h-screen bg-background flex flex-col relative">
            <Header />

            {/* Success Animation Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card p-12 rounded-[2rem] shadow-2xl border border-gold/20 max-w-lg w-full text-center transform animate-in zoom-in-95 duration-500">
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center animate-bounce-twice">
                                <CheckCircle className="w-12 h-12 text-gold" />
                            </div>
                        </div>

                        <h3 className="font-serif text-4xl text-foreground mb-4">Order Confirmed!</h3>
                        <p className="text-xl text-muted-foreground mb-8">Your order has been placed successfully.</p>

                        <div className="bg-muted/50 p-6 rounded-2xl flex items-center gap-6 text-left mb-8 border border-border/50">
                            <div>
                                <p className="font-serif text-2xl text-foreground line-clamp-1 mb-1">{productContext?.title}</p>
                                <p className="text-lg font-serif text-gold">
                                    Purchase Total: ₹{productContext?.price.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <Button
                            className="w-full py-6 text-lg bg-foreground text-background hover:bg-foreground/90 rounded-xl"
                            onClick={() => setShowSuccess(false)}
                        >
                            Back to Chat
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex-1 container mx-auto px-4 md:px-12 pt-28 pb-12 flex gap-6 h-[calc(100vh-100px)]">
                {/* Sidebar - Chat List */}
                <Card className="w-full md:w-80 border-border hidden md:flex flex-col bg-card/50 backdrop-blur-sm">
                    <div className="p-4 border-b border-border">
                        <h2 className="font-serif text-xl font-medium">Messages</h2>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-2">
                            {/* Active Chat Item */}
                            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg cursor-pointer transition-colors border-l-2 border-gold">
                                <Avatar>
                                    <AvatarImage src="https://i.pravatar.cc/150?u=u2" />
                                    <AvatarFallback>SJ</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-medium truncate">Sarah Jenkins</span>
                                        <span className="text-xs text-muted-foreground">10:35 AM</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">I'm thinking of renting it for...</p>
                                </div>
                            </div>

                            {/* Inactive Chat Item */}
                            <div className="flex items-center gap-3 p-3 hover:bg-secondary/20 rounded-lg cursor-pointer transition-colors">
                                <Avatar>
                                    <AvatarImage src="https://i.pravatar.cc/150?u=u3" />
                                    <AvatarFallback>EM</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-medium truncate">Emily Mark</span>
                                        <span className="text-xs text-muted-foreground">Yesterday</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">Thanks for the quick delivery!</p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </Card>

                {/* Chat Area */}
                <Card className="flex-1 border-border flex flex-col bg-card shadow-sm overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/10">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-gold/20">
                                <AvatarImage src="https://i.pravatar.cc/150?u=u2" />
                                <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium">Sarah Jenkins</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-xs text-muted-foreground">Online</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {productContext && (
                                <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="btn-editorial-dark text-xs gap-2 h-9 mr-2">
                                            <ShoppingBag className="w-4 h-4" />
                                            Buy Now ({'₹' + productContext.price.toLocaleString()})
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle className="font-serif text-2xl">Confirm Order</DialogTitle>
                                            <DialogDescription>
                                                Complete your purchase for <strong>{productContext.title}</strong>
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="grid gap-6 py-4">
                                            <div className="space-y-2">
                                                <Label>Product Amount</Label>
                                                <div className="text-2xl font-medium font-serif">₹{productContext.price.toLocaleString()}</div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-medium border-b pb-2">Delivery Information</h4>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="address">Shipping Address</Label>
                                                    <Input id="address" placeholder="123 Fashion St, NY" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="city">City</Label>
                                                        <Input id="city" placeholder="New York" />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="zip">Zip Code</Label>
                                                        <Input id="zip" placeholder="10001" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-medium border-b pb-2">Payment Method</h4>
                                                <Select defaultValue="card">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select payment method" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                                                        <SelectItem value="upi">UPI / Netbanking</SelectItem>
                                                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>Cancel</Button>
                                            <Button onClick={handlePlaceOrder} className="bg-gold hover:bg-gold/90 text-white">Confirm Purchase</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}

                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Phone className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Video className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Info className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4 bg-secondary/5">
                        <div className="space-y-4">
                            <div className="flex justify-center my-4">
                                <span className="text-xs text-muted-foreground bg-background border border-border px-3 py-1 rounded-full">Today, Oct 24</span>
                            </div>

                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${msg.sender === 'me'
                                            ? 'bg-foreground text-background rounded-tr-none'
                                            : 'bg-white border border-border text-foreground rounded-tl-none'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 bg-background border-t border-border">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2 items-center"
                        >
                            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-secondary">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </Button>
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 rounded-full border-border focus-visible:ring-gold bg-secondary/20"
                            />
                            <Button type="submit" size="icon" className="rounded-full bg-gold hover:bg-gold/90 text-white w-10 h-10 flex-shrink-0 transition-transform active:scale-95">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </main>
    );
};

export default Chat;
