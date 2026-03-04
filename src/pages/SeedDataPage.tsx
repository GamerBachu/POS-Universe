import { AlertError, AlertSuccess } from "@/components/ActionStatusMessage";
import Button from "@/components/Button";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import db from "@/libs/db/appDb";
import SeedData, { masterProductData } from "@/libs/db/seedData";
import { LoggerUtils } from "@/utils";
import { useState } from "react";

const SeedDataPage = () => {
    const [processing, setProcessing] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleAddMasterAttributeData = async () => {
        setProcessing(true);
        setSuccessMsg(null);
        setErrorMsg(null);

        const seedData = new SeedData();

        // 1. Create promises that resolve with custom metadata (name + status)
        const promises = seedData.masterProductAttribute.map(async (attr) => {
            try {

                await db.masterProductAttributes.add({
                    id: attr.id,
                    name: attr.name,
                    isActive: true,
                });

                // Resolve with name so we can count it later
                return { name: attr.name, success: true };
            } catch (error) {
                // Reject with the name and the error message
                throw { name: attr.name, success: false, error: error instanceof Error ? error.message : "Unknown error" };
            }
        });

        try {
            // 2. Wait for all to finish
            const results = await Promise.allSettled(promises);

            // 3. Separate results using our custom resolution structure
            const successfulNames: string[] = [];
            const failedDetails: string[] = [];

            results.forEach((result) => {
                if (result.status === "fulfilled") {
                    successfulNames.push(result.value.name);
                } else {
                    // Access the custom object we threw in the catch block
                    const reason = result.reason;
                    failedDetails.push(`${reason.name} (${reason.error})`);
                }
            });

            // 4. Update UI States
            if (successfulNames.length > 0) {
                setSuccessMsg(`Successfully added ${successfulNames.length}`);
            }

            if (failedDetails.length > 0) {
                setErrorMsg(`Failed to add ${failedDetails.length} items: ${failedDetails.join(" | ")}`);
                LoggerUtils.logError(undefined, "MultiAddFailure", failedDetails.join());
            }

        } catch (err) {
            LoggerUtils.logCatch(err, "SeedDataPage", "MultiAddFailure");
            setErrorMsg("A system error occurred during execution.");
        } finally {
            setProcessing(false);
        }
    };

    const handleProductData = async () => {
        setProcessing(true);
        setSuccessMsg(null);
        setErrorMsg(null);

        // 1. Create promises that resolve with custom metadata (name + status)
        const promises = masterProductData.map(async (product: any) => {
            try {
                await db.transaction('rw', [
                    db.products,
                    db.productDescriptions,
                    db.productAttributes,
                    db.productImages,
                    db.productKeywords
                ], async () => {
                    // 1. Destructure the product object
                    const { description, attributes, images, keywords, ...productBase } = product;

                    // 2. Spread productBase so the properties (id, name, etc.) are at the top level
                    await db.products.add({ ...productBase });

                    // 3. Add associated data if they exist
                    if (description) {
                        await db.productDescriptions.add(description);
                    }

                    if (attributes && attributes.length > 0) {
                        await db.productAttributes.bulkAdd(attributes);
                    }

                    if (images && images.length > 0) {
                        await db.productImages.bulkAdd(images);
                    }

                    if (keywords && keywords.length > 0) {
                        await db.productKeywords.bulkAdd(keywords);
                    }
                });

                // Resolve with name so we can count it later
                return { name: product.name, success: true };
            } catch (error) {
                // Reject with the name and the error message
                throw { name: product.name, success: false, error: error instanceof Error ? error.message : "Unknown error" };
            }
        });

        try {
            // 2. Wait for all to finish
            const results = await Promise.allSettled(promises);

            // 3. Separate results using our custom resolution structure
            const successfulNames: string[] = [];
            const failedDetails: string[] = [];

            results.forEach((result) => {
                if (result.status === "fulfilled") {
                    successfulNames.push(result.value.name);
                } else {
                    // Access the custom object we threw in the catch block
                    const reason = result.reason;
                    failedDetails.push(`${reason.name} (${reason.error})`);
                }
            });

            // 4. Update UI States
            if (successfulNames.length > 0) {
                setSuccessMsg(`Successfully added ${successfulNames.length} products.`);
            }

            if (failedDetails.length > 0) {
                setErrorMsg(`Failed to add ${failedDetails.length} products: ${failedDetails.join(" | ")}`);
                LoggerUtils.logError(undefined, "MultiAddFailure", failedDetails.join());
            }

        } catch (err) {
            LoggerUtils.logCatch(err, "SeedDataPage", "MultiAddFailure");
            setErrorMsg("A system error occurred during execution.");
        } finally {
            setProcessing(false);
        }
    };


    return (
        <div className="fixed inset-0 flex overflow-hidden">
            <SideBar />
            <main className="flex-1 flex flex-col overflow-hidden transition-colors duration-200">
                <Header label="App Configuration" />
                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                    <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm max-w-md">
                        <h2 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-tight">
                            Master Data Tools
                        </h2>

                        <Button
                            isLoading={processing}
                            disabled={processing}
                            onClick={handleAddMasterAttributeData}
                            className="bg-blue-600 hover:bg-blue-700 w-full justify-center"
                        >
                            {processing ? "Adding Data..." : "Add Master Attribute Data"}
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm max-w-md">
                        <h2 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-tight">
                            Master Data Tools
                        </h2>

                        <Button
                            isLoading={processing}
                            disabled={processing}
                            onClick={handleProductData}
                            className="bg-blue-600 hover:bg-blue-700 w-full justify-center"
                        >
                            {processing ? "Adding Data..." : "Add Product Data"}
                        </Button>
                    </div>

                    <div className="max-w-md space-y-2">
                        {successMsg && <AlertSuccess message={successMsg} />}
                        {errorMsg && <AlertError message={errorMsg} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SeedDataPage;