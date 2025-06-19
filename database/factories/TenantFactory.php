<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenant>
 */
class TenantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nama = fake()->company();
        return [
            'nama' => $nama,
            'telepon' => fake()->unique()->phoneNumber(),
            'alamat' => fake()->address(),
            'qris' => "qris/1749759802_qris example.png",
            'jam_buka' => fake()->time("H:i"),
            'jam_tutup' => fake()->time("H:i"),
            'tautan' => '/'.str_replace(' ', '-', strtolower($nama)),
            'user_id' => \App\Models\User::factory()->create()->id,
        ];
    }
}
