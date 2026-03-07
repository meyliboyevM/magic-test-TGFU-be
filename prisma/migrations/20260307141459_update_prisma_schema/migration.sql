-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "bgColor" TEXT,
    "type" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestType" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "bgColor" TEXT,
    "type" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TestType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT,
    "bgColor" TEXT,
    "totalQuestions" INTEGER NOT NULL,
    "timeLimitMinutes" INTEGER NOT NULL,
    "questionsPerTest" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectMenu" (
    "subjectId" TEXT NOT NULL,
    "menuId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SubjectMenu_pkey" PRIMARY KEY ("subjectId","menuId")
);

-- CreateTable
CREATE TABLE "SubjectTestType" (
    "subjectId" TEXT NOT NULL,
    "testTypeId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "customName" TEXT,
    "questionCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SubjectTestType_pkey" PRIMARY KEY ("subjectId","testTypeId")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "subjectId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctIndex" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_key_key" ON "Menu"("key");

-- CreateIndex
CREATE UNIQUE INDEX "TestType_key_key" ON "TestType"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_key_key" ON "Subject"("key");

-- CreateIndex
CREATE INDEX "SubjectMenu_menuId_idx" ON "SubjectMenu"("menuId");

-- CreateIndex
CREATE INDEX "SubjectMenu_subjectId_idx" ON "SubjectMenu"("subjectId");

-- CreateIndex
CREATE INDEX "SubjectTestType_testTypeId_idx" ON "SubjectTestType"("testTypeId");

-- CreateIndex
CREATE INDEX "SubjectTestType_subjectId_idx" ON "SubjectTestType"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_question_key" ON "Question"("question");

-- CreateIndex
CREATE INDEX "Question_subjectId_idx" ON "Question"("subjectId");

-- AddForeignKey
ALTER TABLE "SubjectMenu" ADD CONSTRAINT "SubjectMenu_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectMenu" ADD CONSTRAINT "SubjectMenu_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTestType" ADD CONSTRAINT "SubjectTestType_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectTestType" ADD CONSTRAINT "SubjectTestType_testTypeId_fkey" FOREIGN KEY ("testTypeId") REFERENCES "TestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
