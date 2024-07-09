-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "wallet" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");
