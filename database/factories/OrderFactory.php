<?php

namespace Database\Factories;

use App\Models\Menu;
use App\Models\Order;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'telepon' => Str::replace(' ', '', fake()->phoneNumber()),
            'status' => fake()->randomElement(['menunggu', 'diterima', 'siap', 'diambil', 'gagal']),
            'tanggal_pesanan' => now('Asia/Jakarta')->subDays(fake()->numberBetween(0, 7)),
            'total_harga' => fake()->numberBetween(10, 300) * 1000,
            'bukti_pembayaran' => 'bukti_pembayaran/1750666255_VBG WTA 2025.jpg',
            'tenant_id' => \App\Models\Tenant::factory(),
        ];
    }

    public function withMenus($count = 3)
    {
        return $this->afterCreating(function (Order $order) use ($count) {
            $menus = Menu::where('tenant_id', $order->tenant_id)
                ->inRandomOrder()
                ->take($count)
                ->get();

            $pivotData = [];
            $totalHarga = 0;
            foreach ($menus as $menu) {
                $jumlah = fake()->numberBetween(1, 5);
                $pivotData[$menu->id] = [
                    'jumlah' => $jumlah,
                    'harga_satuan' => $menu->harga,
                    'total_harga' => $jumlah * $menu->harga,
                    'catatan' => fake()->sentence(),
                ];
                $totalHarga += $pivotData[$menu->id]['total_harga'];
            }
            $order->total_harga = $totalHarga;
            $order->save();

            $order->menus()->attach($pivotData);
        });
    }
}
