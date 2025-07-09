<?php

namespace Database\Factories;

use App\Models\Menu;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Nasi & Lauk' => 'Berbagai pilihan nasi dengan lauk pauk tradisional dan modern',
            'Ayam Goreng & Bakar' => 'Ayam goreng krispy dan ayam bakar dengan bumbu spesial',
            'Seafood' => 'Hidangan laut segar seperti ikan, udang, dan kerang',
            'Sayuran' => 'Aneka sayuran segar dan tumisan sehat',
            'Mie & Pasta' => 'Berbagai jenis mie dan pasta dengan pilihan topping',
            'Minuman Dingin' => 'Es teh, jus buah, dan minuman segar lainnya',
            'Minuman Hangat' => 'Kopi, teh hangat, dan minuman tradisional',
            'Snack & Gorengan' => 'Camilan ringan dan gorengan tradisional Indonesia',
            'Sup & Soto' => 'Sup hangat dan soto dengan kuah yang gurih',
            'Dessert' => 'Makanan penutup dan es krim untuk penyegar',
            'Makanan Pembuka' => 'Hidangan ringan untuk membuka selera makan',
        ];

        $categoryName = fake()->randomElement(array_keys($categories));

        return [
            'nama' => $categoryName,
            'deskripsi' => $categories[$categoryName],
            'tenant_id' => Tenant::factory(),
        ];
    }

    public static function createAllCategoriesForTenant($tenantId)
    {
        $categories = [
            'Nasi & Lauk' => 'Berbagai pilihan nasi dengan lauk pauk tradisional dan modern',
            'Ayam Goreng & Bakar' => 'Ayam goreng krispy dan ayam bakar dengan bumbu spesial',
            'Seafood' => 'Hidangan laut segar seperti ikan, udang, dan kerang',
            'Sayuran' => 'Aneka sayuran segar dan tumisan sehat',
            'Mie & Pasta' => 'Berbagai jenis mie dan pasta dengan pilihan topping',
            'Minuman Dingin' => 'Es teh, jus buah, dan minuman segar lainnya',
            'Minuman Hangat' => 'Kopi, teh hangat, dan minuman tradisional',
            'Snack & Gorengan' => 'Camilan ringan dan gorengan tradisional Indonesia',
            'Sup & Soto' => 'Sup hangat dan soto dengan kuah yang gurih',
            'Dessert' => 'Makanan penutup dan es krim untuk penyegar',
            'Makanan Pembuka' => 'Hidangan ringan untuk membuka selera makan',
        ];

        $createdCategories = [];

        foreach ($categories as $categoryName => $description) {
            $category = \App\Models\Category::create([
                'nama' => $categoryName,
                'deskripsi' => $description,
                'tenant_id' => $tenantId,
            ]);

            // Otomatis tambahkan menu untuk setiap kategori
            static::createMenusForCategory($category);

            $createdCategories[] = $category;
        }

        return $createdCategories;
    }

    public static function createMenusForCategory($category)
    {
        $menusByCategory = [
            'Nasi & Lauk' => [
                ['nama' => 'Nasi Gudeg Komplit', 'harga' => 15000, 'deskripsi' => 'Nasi gudeg dengan ayam, telur, dan sambal krecek'],
                ['nama' => 'Nasi Rawon', 'harga' => 18000, 'deskripsi' => 'Nasi dengan rawon daging sapi dan pelengkap'],
                ['nama' => 'Nasi Pecel', 'harga' => 12000, 'deskripsi' => 'Nasi dengan sayuran rebus dan bumbu pecel kacang'],
                ['nama' => 'Nasi Campur', 'harga' => 20000, 'deskripsi' => 'Nasi dengan berbagai lauk pilihan'],
                ['nama' => 'Nasi Rendang', 'harga' => 25000, 'deskripsi' => 'Nasi dengan rendang daging sapi yang empuk'],
                ['nama' => 'Nasi Bebek', 'harga' => 22000, 'deskripsi' => 'Nasi dengan bebek goreng atau bakar'],
                ['nama' => 'Nasi Liwet', 'harga' => 16000, 'deskripsi' => 'Nasi liwet dengan lauk tradisional'],
                ['nama' => 'Nasi Tumpeng Mini', 'harga' => 14000, 'deskripsi' => 'Nasi kuning dengan lauk pelengkap'],
            ],
            'Ayam Goreng & Bakar' => [
                ['nama' => 'Ayam Goreng Kremes', 'harga' => 15000, 'deskripsi' => 'Ayam goreng dengan kremes renyah dan sambal'],
                ['nama' => 'Ayam Bakar Madu', 'harga' => 18000, 'deskripsi' => 'Ayam bakar dengan bumbu madu dan kecap manis'],
                ['nama' => 'Ayam Geprek', 'harga' => 16000, 'deskripsi' => 'Ayam goreng geprek dengan sambal pedas'],
                ['nama' => 'Ayam Kalasan', 'harga' => 17000, 'deskripsi' => 'Ayam goreng bumbu kalasan yang gurih'],
                ['nama' => 'Ayam Penyet', 'harga' => 14000, 'deskripsi' => 'Ayam goreng penyet dengan sambal terasi'],
                ['nama' => 'Ayam Bakar Taliwang', 'harga' => 19000, 'deskripsi' => 'Ayam bakar khas Lombok dengan bumbu pedas'],
                ['nama' => 'Ayam Goreng Lengkuas', 'harga' => 16000, 'deskripsi' => 'Ayam goreng dengan bumbu lengkuas yang harum'],
                ['nama' => 'Ayam Rica-Rica', 'harga' => 18000, 'deskripsi' => 'Ayam dengan bumbu rica-rica pedas'],
            ],
            'Seafood' => [
                ['nama' => 'Ikan Bakar Kecap', 'harga' => 22000, 'deskripsi' => 'Ikan bakar dengan bumbu kecap manis dan cabai'],
                ['nama' => 'Udang Goreng Tepung', 'harga' => 28000, 'deskripsi' => 'Udang goreng dengan tepung crispy'],
                ['nama' => 'Cumi Bakar', 'harga' => 25000, 'deskripsi' => 'Cumi bakar dengan bumbu rica-rica'],
                ['nama' => 'Gurame Asam Manis', 'harga' => 35000, 'deskripsi' => 'Gurame goreng dengan saus asam manis'],
                ['nama' => 'Kerang Hijau Rebus', 'harga' => 20000, 'deskripsi' => 'Kerang hijau rebus dengan kuah jahe'],
                ['nama' => 'Ikan Nila Bakar', 'harga' => 18000, 'deskripsi' => 'Ikan nila bakar dengan sambal dabu-dabu'],
                ['nama' => 'Udang Asam Manis', 'harga' => 30000, 'deskripsi' => 'Udang dengan saus asam manis pedas'],
                ['nama' => 'Kepiting Saus Padang', 'harga' => 45000, 'deskripsi' => 'Kepiting dengan saus padang yang gurih'],
            ],
            'Sayuran' => [
                ['nama' => 'Gado-gado', 'harga' => 10000, 'deskripsi' => 'Sayuran segar dengan bumbu kacang dan kerupuk'],
                ['nama' => 'Tumis Kangkung', 'harga' => 8000, 'deskripsi' => 'Kangkung tumis dengan bumbu terasi'],
                ['nama' => 'Tumis Tauge', 'harga' => 7000, 'deskripsi' => 'Tauge tumis dengan bumbu sederhana'],
                ['nama' => 'Capcay Kuah', 'harga' => 12000, 'deskripsi' => 'Sayuran campur dengan kuah gurih'],
                ['nama' => 'Terong Balado', 'harga' => 9000, 'deskripsi' => 'Terong goreng dengan sambal balado'],
                ['nama' => 'Tumis Buncis', 'harga' => 8000, 'deskripsi' => 'Buncis tumis dengan bumbu bawang'],
                ['nama' => 'Sayur Asem', 'harga' => 6000, 'deskripsi' => 'Sayur asem dengan kuah segar'],
                ['nama' => 'Lalapan Segar', 'harga' => 5000, 'deskripsi' => 'Sayuran mentah segar dengan sambal'],
            ],
            'Mie & Pasta' => [
                ['nama' => 'Mie Ayam Bakso', 'harga' => 12000, 'deskripsi' => 'Mie dengan ayam suwir dan bakso kuah'],
                ['nama' => 'Mie Goreng Spesial', 'harga' => 15000, 'deskripsi' => 'Mie goreng dengan telur dan sayuran'],
                ['nama' => 'Kwetiau Goreng', 'harga' => 14000, 'deskripsi' => 'Kwetiau goreng dengan daging dan sayuran'],
                ['nama' => 'Bihun Goreng', 'harga' => 11000, 'deskripsi' => 'Bihun goreng dengan bumbu spesial'],
                ['nama' => 'Mie Rebus', 'harga' => 10000, 'deskripsi' => 'Mie kuah dengan sayuran dan telur'],
                ['nama' => 'Indomie Goreng', 'harga' => 8000, 'deskripsi' => 'Indomie goreng dengan telur mata sapi'],
                ['nama' => 'Mie Tektek', 'harga' => 13000, 'deskripsi' => 'Mie goreng ala gerobak dengan sayuran'],
                ['nama' => 'Kwetiau Siram', 'harga' => 16000, 'deskripsi' => 'Kwetiau dengan kuah kental dan seafood'],
            ],
            'Minuman Dingin' => [
                ['nama' => 'Es Teh Manis', 'harga' => 3000, 'deskripsi' => 'Teh manis dingin yang menyegarkan'],
                ['nama' => 'Es Jeruk', 'harga' => 5000, 'deskripsi' => 'Jus jeruk segar dengan es batu'],
                ['nama' => 'Es Campur', 'harga' => 8000, 'deskripsi' => 'Es serut dengan berbagai topping'],
                ['nama' => 'Es Kelapa Muda', 'harga' => 7000, 'deskripsi' => 'Air kelapa muda segar dengan es'],
                ['nama' => 'Es Alpukat', 'harga' => 10000, 'deskripsi' => 'Jus alpukat dengan susu dan gula aren'],
                ['nama' => 'Es Cendol', 'harga' => 6000, 'deskripsi' => 'Cendol dengan santan dan gula merah'],
                ['nama' => 'Es Dawet', 'harga' => 5000, 'deskripsi' => 'Dawet dengan kuah santan manis'],
                ['nama' => 'Es Buah', 'harga' => 9000, 'deskripsi' => 'Campuran buah segar dengan es serut'],
            ],
            'Minuman Hangat' => [
                ['nama' => 'Kopi Hitam', 'harga' => 4000, 'deskripsi' => 'Kopi hitam tubruk tradisional'],
                ['nama' => 'Teh Hangat', 'harga' => 3000, 'deskripsi' => 'Teh celup hangat dengan gula'],
                ['nama' => 'Jahe Hangat', 'harga' => 5000, 'deskripsi' => 'Minuman jahe hangat dengan gula merah'],
                ['nama' => 'Kopi Susu', 'harga' => 6000, 'deskripsi' => 'Kopi dengan susu kental manis'],
                ['nama' => 'Wedang Uwuh', 'harga' => 7000, 'deskripsi' => 'Minuman herbal tradisional Jogja'],
                ['nama' => 'Teh Tarik', 'harga' => 5000, 'deskripsi' => 'Teh susu yang ditarik dengan teknik khusus'],
                ['nama' => 'Bandrek', 'harga' => 6000, 'deskripsi' => 'Minuman hangat dengan jahe dan kelapa'],
                ['nama' => 'Bajigur', 'harga' => 7000, 'deskripsi' => 'Minuman hangat dengan santan dan gula aren'],
            ],
            'Snack & Gorengan' => [
                ['nama' => 'Pisang Goreng', 'harga' => 2000, 'deskripsi' => 'Pisang goreng dengan tepung crispy'],
                ['nama' => 'Tahu Isi', 'harga' => 3000, 'deskripsi' => 'Tahu goreng isi sayuran dan tauge'],
                ['nama' => 'Tempe Mendoan', 'harga' => 2500, 'deskripsi' => 'Tempe goreng tepung ala Banyumas'],
                ['nama' => 'Bakwan Sayur', 'harga' => 2000, 'deskripsi' => 'Bakwan goreng dengan isian sayuran'],
                ['nama' => 'Cireng', 'harga' => 1500, 'deskripsi' => 'Aci digoreng dengan bumbu rujak'],
                ['nama' => 'Combro', 'harga' => 2500, 'deskripsi' => 'Singkong isi oncom yang digoreng'],
                ['nama' => 'Risoles', 'harga' => 3000, 'deskripsi' => 'Risoles isi sayuran dengan kulit yang renyah'],
                ['nama' => 'Gehu', 'harga' => 2000, 'deskripsi' => 'Tahu goreng isi tauge khas Bandung'],
            ],
            'Sup & Soto' => [
                ['nama' => 'Soto Ayam', 'harga' => 12000, 'deskripsi' => 'Soto ayam dengan kuah bening dan pelengkap'],
                ['nama' => 'Sup Ayam', 'harga' => 10000, 'deskripsi' => 'Sup ayam hangat dengan sayuran'],
                ['nama' => 'Soto Betawi', 'harga' => 15000, 'deskripsi' => 'Soto khas Betawi dengan santan'],
                ['nama' => 'Bakso Kuah', 'harga' => 8000, 'deskripsi' => 'Bakso dengan kuah kaldu sapi'],
                ['nama' => 'Sup Iga', 'harga' => 18000, 'deskripsi' => 'Sup iga sapi dengan kuah bening'],
                ['nama' => 'Soto Kudus', 'harga' => 13000, 'deskripsi' => 'Soto khas Kudus dengan kuah gurih'],
                ['nama' => 'Coto Makassar', 'harga' => 16000, 'deskripsi' => 'Sup daging khas Makassar yang kaya rempah'],
                ['nama' => 'Sup Konro', 'harga' => 20000, 'deskripsi' => 'Sup iga bakar khas Makassar'],
            ],
            'Dessert' => [
                ['nama' => 'Es Krim Goreng', 'harga' => 8000, 'deskripsi' => 'Es krim vanilla goreng dengan madu'],
                ['nama' => 'Pisang Bakar', 'harga' => 5000, 'deskripsi' => 'Pisang bakar dengan keju dan coklat'],
                ['nama' => 'Klepon', 'harga' => 6000, 'deskripsi' => 'Kue klepon dengan gula merah dan kelapa'],
                ['nama' => 'Es Doger', 'harga' => 7000, 'deskripsi' => 'Es serut dengan tape dan kelapa muda'],
                ['nama' => 'Pudding Roti', 'harga' => 9000, 'deskripsi' => 'Pudding roti dengan saus vanilla'],
                ['nama' => 'Martabak Manis', 'harga' => 12000, 'deskripsi' => 'Martabak manis dengan berbagai topping'],
                ['nama' => 'Dadar Gulung', 'harga' => 4000, 'deskripsi' => 'Dadar gulung dengan isian kelapa manis'],
                ['nama' => 'Onde-onde', 'harga' => 3000, 'deskripsi' => 'Onde-onde dengan wijen dan isian kacang hijau'],
            ],
            'Makanan Pembuka' => [
                ['nama' => 'Kerupuk Udang', 'harga' => 3000, 'deskripsi' => 'Kerupuk udang renyah sebagai pembuka'],
                ['nama' => 'Lumpia Semarang', 'harga' => 5000, 'deskripsi' => 'Lumpia khas Semarang dengan isian rebung'],
                ['nama' => 'Siomay', 'harga' => 8000, 'deskripsi' => 'Siomay dengan bumbu kacang dan sambal'],
                ['nama' => 'Batagor', 'harga' => 7000, 'deskripsi' => 'Baso tahu goreng dengan bumbu kacang'],
                ['nama' => 'Pempek Kapal Selam', 'harga' => 6000, 'deskripsi' => 'Pempek dengan telur dan kuah cuko'],
                ['nama' => 'Otak-otak', 'harga' => 4000, 'deskripsi' => 'Otak-otak ikan dengan bumbu rempah'],
                ['nama' => 'Lemper', 'harga' => 3500, 'deskripsi' => 'Lemper dengan isian ayam dan serundeng'],
                ['nama' => 'Pastel', 'harga' => 4500, 'deskripsi' => 'Pastel goreng dengan isian sayuran'],
            ],
        ];

        $categoryMenus = $menusByCategory[$category->nama] ?? [];

        foreach ($categoryMenus as $menuData) {
            $nama = str_replace(' ', '-', strtolower($menuData['nama']));
            Menu::create([
                'nama' => $menuData['nama'],
                'status' => fake()->randomElement(['tersedia', 'tidak tersedia']),
                'harga' => $menuData['harga'],
                'deskripsi' => $menuData['deskripsi'],
                'foto' => "menu/{$nama}.jpg",
                'category_id' => $category->id,
                'tenant_id' => $category->tenant_id,
            ]);
        }
    }
}
