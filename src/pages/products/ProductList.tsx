import { useNavigate } from "react-router-dom";
import resource from "@/locales/en.json";
import { type IProduct } from "@/types/product";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { PATHS } from "@/routes/paths";


const ProductList = () => {
    const navigate = useNavigate();
    // In real app, fetch this from Dexie: const products = useLiveQuery(() => db.products.toArray());
    const products: IProduct[] = [
        {
            id: 1,
            name: "Logitech MX Master 3S",
            price: 99.99,
            stock: 45,
            serial: "SN-MX3S-9921",
            model: "MXM3S",
            batch: "B-2024-001",
            expiry: "2029-12-31",
            category: "Peripherals",
            manufacturer: "Logitech",
            description: "Wireless performance mouse with silent clicks.",
        },
        {
            id: 2,
            name: "Keychron K2 V2",
            price: 89.0,
            stock: 12,
            serial: "SN-K2V2-1102",
            model: "K2-H3",
            batch: "B-2024-002",
            expiry: "2030-01-01",
            category: "Peripherals",
            manufacturer: "Keychron",
            description: "Mechanical keyboard with brown switches.",
        },
        {
            id: 3,
            name: "Samsung Odyssey G7",
            price: 549.99,
            stock: 8,
            serial: "SN-SAM-G7-221",
            model: "LS32CG70",
            batch: "B-2023-991",
            expiry: "2028-06-15",
            category: "Monitors",
            manufacturer: "Samsung",
            description: "32-inch Curved 240Hz Gaming Monitor.",
        },
        {
            id: 4,
            name: "Dell XPS 15 9530",
            price: 2199.0,
            stock: 5,
            serial: "SN-XPS15-4421",
            model: "XPS9530-7000",
            batch: "B-2024-010",
            expiry: "2027-01-01",
            category: "Laptops",
            manufacturer: "Dell",
            description: "Premium laptop with OLED display and i9 processor.",
        },
        {
            id: 5,
            name: "SanDisk Extreme Pro 1TB",
            price: 129.99,
            stock: 100,
            serial: "SN-SD-1TB-001",
            model: "SDCZ880-1T00",
            batch: "B-2024-045",
            expiry: "2034-10-10",
            category: "Storage",
            manufacturer: "Western Digital",
            description: "Ultra-fast USB 3.2 solid state flash drive.",
        },
        {
            id: 6,
            name: "Sony WH-1000XM5",
            price: 398.0,
            stock: 15,
            serial: "SN-SONY-XM5-88",
            model: "WH1000XM5/B",
            batch: "B-2024-102",
            expiry: "2029-05-20",
            category: "Audio",
            manufacturer: "Sony",
            description: "Industry leading noise canceling headphones.",
        },
        {
            id: 7,
            name: "ASUS ROG Swift PG279QM",
            price: 749.0,
            stock: 3,
            serial: "SN-ASUS-PG27",
            model: "PG279QM",
            batch: "B-2023-112",
            expiry: "2028-11-11",
            category: "Monitors",
            manufacturer: "ASUS",
            description: "27-inch 1440p 240Hz G-Sync monitor.",
        },
        {
            id: 8,
            name: "Blue Yeti USB Mic",
            price: 129.0,
            stock: 22,
            serial: "SN-BLUE-YETI-09",
            model: "YETI-SILVER",
            batch: "B-2024-005",
            expiry: "2030-12-12",
            category: "Audio",
            manufacturer: "Logitech",
            description: "Professional multi-pattern USB microphone.",
        },
        {
            id: 9,
            name: "Apple MacBook Air M2",
            price: 1099.0,
            stock: 14,
            serial: "SN-APL-AIR-M2",
            model: "MLXY3LL/A",
            batch: "B-2024-M2",
            expiry: "2027-09-09",
            category: "Laptops",
            manufacturer: "Apple",
            description: "Thin and light laptop with M2 chip.",
        },
        {
            id: 10,
            name: "Corsair Vengeance 32GB",
            price: 115.0,
            stock: 40,
            serial: "SN-COR-DDR5-32",
            model: "CMK32GX5M2B",
            batch: "B-2024-R01",
            expiry: "2035-01-01",
            category: "Components",
            manufacturer: "Corsair",
            description: "DDR5 6000MHz CL36 Desktop Memory.",
        },
        {
            id: 11,
            name: "WD Black SN850X 2TB",
            price: 189.99,
            stock: 25,
            serial: "SN-WD-SN850-2T",
            model: "WDS200T2X0E",
            batch: "B-2024-S02",
            expiry: "2030-12-31",
            category: "Storage",
            manufacturer: "Western Digital",
            description: "High-performance PCIe Gen4 NVMe SSD.",
        },
        {
            id: 12,
            name: "Razer DeathAdder V3",
            price: 69.99,
            stock: 33,
            serial: "SN-RAZ-DV3-112",
            model: "RZ01-0464",
            batch: "B-2024-998",
            expiry: "2029-01-01",
            category: "Peripherals",
            manufacturer: "Razer",
            description: "Wired ultra-lightweight gaming mouse.",
        },
        {
            id: 13,
            name: "EVGA SuperNOVA 850G",
            price: 159.0,
            stock: 10,
            serial: "SN-EVGA-850-PSU",
            model: "220-G6-0850-X1",
            batch: "B-2023-P04",
            expiry: "2033-01-01",
            category: "Components",
            manufacturer: "EVGA",
            description: "850W Gold Fully Modular Power Supply.",
        },
        {
            id: 14,
            name: "TP-Link AX6000 Wi-Fi 6",
            price: 249.99,
            stock: 18,
            serial: "SN-TP-AX6-001",
            model: "Archer AX6000",
            batch: "B-2024-N01",
            expiry: "2029-03-01",
            category: "Networking",
            manufacturer: "TP-Link",
            description: "Next-gen Wi-Fi 6 router for high-speed internet.",
        },
        {
            id: 15,
            name: "SteelSeries Arctis Nova Pro",
            price: 349.0,
            stock: 7,
            serial: "SN-SS-NOVA-PRO",
            model: "61520",
            batch: "B-2024-A05",
            expiry: "2029-08-15",
            category: "Audio",
            manufacturer: "SteelSeries",
            description: "Premium gaming headset with high-fidelity audio.",
        },
        {
            id: 16,
            name: "Epson EcoTank ET-2800",
            price: 279.0,
            stock: 12,
            serial: "SN-EPS-ET28-091",
            model: "C11CJ67201",
            batch: "B-2024-PRN",
            expiry: "2028-12-12",
            category: "Office",
            manufacturer: "Epson",
            description: "Cartridge-free supertank printer with scan/copy.",
        },
        {
            id: 17,
            name: "Anker 737 Power Bank",
            price: 149.0,
            stock: 50,
            serial: "SN-ANKER-737",
            model: "A1289",
            batch: "B-2024-PWR",
            expiry: "2027-01-01",
            category: "Accessories",
            manufacturer: "Anker",
            description: "24,000mAh portable charger with 140W output.",
        },
        {
            id: 18,
            name: "Elgato Stream Deck MK.2",
            price: 149.99,
            stock: 20,
            serial: "SN-ELG-SD-MK2",
            model: "10GBA9901",
            batch: "B-2024-STR",
            expiry: "2031-01-01",
            category: "Peripherals",
            manufacturer: "Elgato",
            description: "Studio controller with 15 macro keys.",
        },
        {
            id: 19,
            name: "Noctua NH-D15 chromax.black",
            price: 119.0,
            stock: 15,
            serial: "SN-NOC-D15-BLK",
            model: "NH-D15-CH-BK",
            batch: "B-2024-CLR",
            expiry: "2040-01-01",
            category: "Components",
            manufacturer: "Noctua",
            description: "Premium dual-tower CPU cooler for silent cooling.",
        },
        {
            id: 20,
            name: "Herman Miller Aeron",
            price: 1600.0,
            stock: 4,
            serial: "SN-HM-AERON-2024",
            model: "AERON-SIZE-B",
            batch: "B-2024-FURN",
            expiry: "2036-01-01",
            category: "Office",
            manufacturer: "Herman Miller",
            description: "Ergonomic mesh office chair.",
        },
    ];

    return (

        <div className="fixed inset-0 flex overflow-hidden">
            <SideBar></SideBar>
            <main className="flex-1 flex flex-col overflow-hidden transition-colors duration-200">
                <Header label={resource.navigation.product_list_label}></Header>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800">
                    <div className="p-6">
                        <div className="flex justify-between mb-4">
                            <h1 className="text-2xl font-bold">
                            </h1>
                            <button
                                onClick={() => navigate(PATHS.PRODUCT_ADD)}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                {resource.product_inventory.btn_add}
                            </button>
                        </div>

                        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Stock</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        >
                                            <td className="p-4">{p.name}</td>
                                            <td className="p-4">${p.price}</td>
                                            <td className="p-4">{p.stock}</td>
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    onClick={() => navigate(`${PATHS.PRODUCT_VIEW}/${p.id}`)}
                                                    title={resource.product_inventory.btn_view}
                                                >
                                                    🔍
                                                </button>
                                                <button
                                                    onClick={() => navigate(`${PATHS.PRODUCT_EDIT}/${p.id}`)}
                                                    title={resource.product_inventory.btn_edit}
                                                >
                                                    ✏️
                                                </button>

                                                <button
                                                    onClick={() => navigate(`${PATHS.PRODUCT_DELETE}/${p.id}`)}
                                                    title={resource.product_inventory.btn_delete}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
};
export default ProductList;
