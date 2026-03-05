-- CreateTable
CREATE TABLE "TestIntroMenu" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL,

    CONSTRAINT "TestIntroMenu_pkey" PRIMARY KEY ("id")
);
