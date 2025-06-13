<?php

namespace Database\Factories;

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
            'tanggal_pesanan' => fake()->dateTimeThisYear(),
            'nama_pemesan' => fake()->name(),
            'telepon_pemesan' => fake()->phoneNumber(),
            'status' => fake()->randomElement(['menunggu', 'diterima', 'siap', 'diambil', 'gagal']),
            'total_harga' => fake()->numberBetween(10, 300) * 1000,
            'tenant_id' => \App\Models\Tenant::factory(),
        ];
    }
}
