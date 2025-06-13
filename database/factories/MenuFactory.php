<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Menu>
 */
class MenuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->unique()->sentence(3),
            'status' => fake()->randomElement(['tersedia', 'tidak tersedia']),
            'harga' => fake()->numberBetween(10, 100) * 1000,
            'deskripsi' => fake()->sentence(8),
            'gambar' => fake()->imageUrl(640, 480, 'food', true),
            'category_id' => \App\Models\Category::factory(),
            'tenant_id' => \App\Models\Tenant::factory(),
        ];
    }
}
