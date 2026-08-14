const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/ankus/OneDrive/Desktop/CodeAlpha projects/aura-ecommerce';
const files = [
  'src/app/admin/orders/page.tsx',
  'src/app/admin/products/AdminProductManager.tsx',
  'src/app/checkout/page.tsx',
  'src/app/dashboard/orders/page.tsx',
  'src/app/products/page.tsx',
  'src/app/products/[slug]/page.tsx',
  'src/components/AiAssistant.tsx',
  'src/components/CartDrawer.tsx',
  'src/components/CompareModal.tsx',
  'src/components/ProductCard.tsx'
];

files.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Example matches: >${item.price.toFixed(2)}<
  // We want to replace $> with ₹> if they were >$
  content = content.replace(/\$\{([^}]*price[^}]*)\}/g, '₹{$1}');
  content = content.replace(/\$\{([^}]*Amount[^}]*)\}/g, '₹{$1}');
  content = content.replace(/\$\{([^}]*subtotal[^}]*)\}/g, '₹{$1}');
  content = content.replace(/\$\{([^}]*Total[^}]*)\}/g, '₹{$1}');
  content = content.replace(/\$\{([^}]*delivery[^}]*)\}/g, '₹{$1}');
  content = content.replace(/\$\{([^}]*\.toFixed[^}]*)\}/g, '₹{$1}');
  
  // Replace literal $ followed by {
  // In JSX we write >${...}< and that means literal text $ followed by expression value.
  // Wait, no. In JSX it's written as: >${item.price.toFixed(2)}<
  // But my regex replaced ${...} with ₹{...}.
  // Let's actually replace >$ with >₹
  content = content.replace(/>\$/g, '>₹');
  // Also "> $ "
  content = content.replace(/>\s*\$/g, '>₹');
  // and "$ " at start of text node, or just literal $ in strings
  content = content.replace(/Price \(\$\)/g, 'Price (₹)');
  content = content.replace(/Under \$50/g, 'Under ₹50');
  content = content.replace(/\$50 \- \$150/g, '₹50 - ₹150');
  content = content.replace(/Over \$150/g, 'Over ₹150');
  content = content.replace(/under \$120/g, 'under ₹120');
  content = content.replace(/under \$150/g, 'under ₹150');
  
  content = content.replace(/`Pay \$\$\{/g, '`Pay ₹${');
  
  // To avoid replacing ${var} if not preceded by $ and not a price, 
  // actually in JSX, if you write >${var}<, it literally renders $var.
  // In `> ${var} <` it renders $ var.
  
  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Currency updated to ₹');
