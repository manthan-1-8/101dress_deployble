import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShieldCheck, ArrowLeft, Package, Truck, RotateCcw } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  category: string;
  brand: string;
  size: string;
  condition: string;
  type: string;
  sale_price?: number;
  rent_price?: number;
  deposit?: number;
  image: string;
  status: string;
  verified: boolean;
  seller_id: string;
}

interface Seller {
  id: string;
  name: string;
  trust_score: number;
  avatar: string;
}

const fetchProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`http://localhost:8000/api/items/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

const fetchSeller = async (sellerId: string): Promise<Seller> => {
  const response = await fetch(`http://localhost:8000/api/users/${sellerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch seller');
  }
  return response.json();
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });

  const { data: seller } = useQuery({
    queryKey: ['seller', product?.seller_id],
    queryFn: () => fetchSeller(product!.seller_id),
    enabled: !!product?.seller_id,
  });

  if (productLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 md:px-12 pt-32 pb-20">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8" />
            <div className="grid md:grid-cols-2 gap-12">
              <div className="aspect-[3/4] bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-12 bg-muted rounded" />
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 md:px-12 pt-32 pb-20 text-center">
          <h1 className="font-serif text-4xl mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 md:px-12 pt-32 pb-20">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm uppercase tracking-wide">Back to Collection</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-32">
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.verified && (
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-md flex items-center gap-2 shadow-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">Platform Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex gap-2 mb-4">
                {product.type !== 'rent' && (
                  <Badge className="bg-primary text-primary-foreground">For Sale</Badge>
                )}
                {product.type !== 'sale' && (
                  <Badge variant="secondary">For Rent</Badge>
                )}
                <Badge variant="outline">{product.condition} Condition</Badge>
              </div>
              <h1 className="font-serif text-4xl lg:text-5xl font-light text-foreground mb-3">
                {product.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {product.brand} • Size {product.size}
              </p>
            </div>

            {/* Pricing */}
            <Card className="p-6 space-y-4 bg-secondary/20 border-border">
              {(product.type === 'both' || product.type === 'sale') && product.sale_price && (
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                      Purchase Price
                    </p>
                    <p className="text-3xl font-medium text-foreground">
                      ₹{product.sale_price.toLocaleString()}
                    </p>
                  </div>
                  <Button size="lg" className="btn-editorial-dark">
                    Buy Now
                  </Button>
                </div>
              )}

              {(product.type === 'both' || product.type === 'rent') && product.rent_price && (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                      Rental Price / Day
                    </p>
                    <p className="text-3xl font-medium text-foreground">
                      ₹{product.rent_price.toLocaleString()}
                    </p>
                    {product.deposit && (
                      <p className="text-sm text-muted-foreground mt-1">
                        + ₹{product.deposit.toLocaleString()} refundable deposit
                      </p>
                    )}
                  </div>
                  <Button size="lg" variant="outline" className="border-2">
                    Rent Item
                  </Button>
                </div>
              )}
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background border border-border rounded-lg">
                <Package className="w-6 h-6 mx-auto mb-2 text-gold" />
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Secure Packaging
                </p>
              </div>
              <div className="text-center p-4 bg-background border border-border rounded-lg">
                <Truck className="w-6 h-6 mx-auto mb-2 text-gold" />
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Fast Shipping
                </p>
              </div>
              <div className="text-center p-4 bg-background border border-border rounded-lg">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-gold" />
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Easy Returns
                </p>
              </div>
            </div>

            {/* Seller Info */}
            {seller && (
              <Card className="p-6 border-border">
                <h3 className="font-serif text-xl font-medium mb-4">Seller Information</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{seller.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-muted-foreground">
                        Trust Score: {seller.trust_score}/100
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Product Details */}
            <Card className="p-6 border-border">
              <h3 className="font-serif text-xl font-medium mb-4">Product Details</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium capitalize">{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Brand</dt>
                  <dd className="font-medium">{product.brand}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Size</dt>
                  <dd className="font-medium">{product.size}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Condition</dt>
                  <dd className="font-medium">{product.condition}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium capitalize">{product.status}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProductDetail;
