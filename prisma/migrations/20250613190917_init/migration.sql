-- CreateTable
CREATE TABLE "EcommerceStore" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EcommerceStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "price" TEXT,
    "image" TEXT,
    "sku" TEXT,
    "embedding" DOUBLE PRECISION[],
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EcommerceStore_domain_key" ON "EcommerceStore"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "EcommerceStore_apiKey_key" ON "EcommerceStore"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "Product_title_url_storeId_key" ON "Product"("title", "url", "storeId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "EcommerceStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
