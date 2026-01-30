import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Camera, Sparkles } from 'lucide-react';

const SellItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: '',
    size: '',
    condition: '',
    listingType: 'sale',
    salePrice: '',
    rentPrice: '',
    deposit: '',
    description: '',
  });

  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement API call to create listing
    console.log('Listing data:', formData);
    console.log('Images:', images);
    // Navigate to profile after successful submission
    // navigate('/profile');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages([...images, ...newImages]);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 md:px-12 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-px bg-gold" />
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl font-light text-foreground mb-4">
            List Your Item
          </h1>
          <p className="text-muted-foreground text-lg">
            Share your designer pieces with our curated community. Each listing is
            reviewed to maintain our quality standards.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <Card className="p-8 border-border">
              <h2 className="font-serif text-2xl font-medium mb-6">Photos</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-muted rounded-lg overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gold transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload</span>
                  </label>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Camera className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Add up to 8 high-quality photos. Use natural lighting and show
                    all angles. AI quality check will verify your images.
                  </p>
                </div>
              </div>
            </Card>

            {/* Item Details */}
            <Card className="p-8 border-border">
              <h2 className="font-serif text-2xl font-medium mb-6">Item Details</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Elegant Red Evening Gown"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      placeholder="e.g., Sabyasachi, Manish Malhotra"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dress">Dress</SelectItem>
                        <SelectItem value="lehenga">Lehenga</SelectItem>
                        <SelectItem value="saree">Saree</SelectItem>
                        <SelectItem value="gown">Gown</SelectItem>
                        <SelectItem value="suit">Suit</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="size">Size *</Label>
                    <Select
                      value={formData.size}
                      onValueChange={(value) =>
                        setFormData({ ...formData, size: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) =>
                        setFormData({ ...formData, condition: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-8 border-border">
              <h2 className="font-serif text-2xl font-medium mb-6">
                Pricing & Availability
              </h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Listing Type *</Label>
                  <RadioGroup
                    value={formData.listingType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, listingType: value })
                    }
                    className="grid md:grid-cols-3 gap-4"
                  >
                    <label className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:border-gold transition-colors">
                      <RadioGroupItem value="sale" id="sale" />
                      <div>
                        <p className="font-medium">Sale Only</p>
                        <p className="text-sm text-muted-foreground">
                          Sell permanently
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:border-gold transition-colors">
                      <RadioGroupItem value="rent" id="rent" />
                      <div>
                        <p className="font-medium">Rent Only</p>
                        <p className="text-sm text-muted-foreground">
                          Rent temporarily
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:border-gold transition-colors">
                      <RadioGroupItem value="both" id="both" />
                      <div>
                        <p className="font-medium">Both</p>
                        <p className="text-sm text-muted-foreground">
                          Sell or rent
                        </p>
                      </div>
                    </label>
                  </RadioGroup>
                </div>

                {(formData.listingType === 'sale' ||
                  formData.listingType === 'both') && (
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price (₹) *</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      placeholder="25000"
                      value={formData.salePrice}
                      onChange={(e) =>
                        setFormData({ ...formData, salePrice: e.target.value })
                      }
                      required={
                        formData.listingType === 'sale' ||
                        formData.listingType === 'both'
                      }
                    />
                  </div>
                )}

                {(formData.listingType === 'rent' ||
                  formData.listingType === 'both') && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="rentPrice">Rent Price/Day (₹) *</Label>
                      <Input
                        id="rentPrice"
                        type="number"
                        placeholder="2500"
                        value={formData.rentPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, rentPrice: e.target.value })
                        }
                        required={
                          formData.listingType === 'rent' ||
                          formData.listingType === 'both'
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deposit">Refundable Deposit (₹) *</Label>
                      <Input
                        id="deposit"
                        type="number"
                        placeholder="10000"
                        value={formData.deposit}
                        onChange={(e) =>
                          setFormData({ ...formData, deposit: e.target.value })
                        }
                        required={
                          formData.listingType === 'rent' ||
                          formData.listingType === 'both'
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Features */}
            <Card className="p-8 border-border bg-gradient-to-br from-secondary/20 to-transparent">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl font-medium mb-2">
                    AI-Powered Quality Check
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your listing will be reviewed by our AI system to ensure image
                    quality and authenticity. Platform verification badge is awarded
                    to high-quality listings.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      Image quality analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      Fraud detection
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      Trust score impact
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I confirm that this item is authentic and in the condition stated. I
                agree to the{' '}
                <a href="#terms" className="underline hover:text-foreground">
                  Seller Terms & Conditions
                </a>
                .
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-editorial-dark">
                Submit for Review
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default SellItem;
