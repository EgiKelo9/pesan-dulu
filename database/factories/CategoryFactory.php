<?php

namespace Database\Factories;

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
        return [
            'nama' => fake()->unique()->word(),
            'deskripsi' => fake()->sentence(),
            'tenant_id' => \App\Models\Tenant::factory(),
        ];
    }

    public function withMenus($count = 5)
    {
        return $this->afterCreating(function ($category) use ($count) {
            $menus = \App\Models\Menu::factory($count)->create([
                'category_id' => $category->id,
                'tenant_id' => $category->tenant_id,
            ]);
            $category->menus()->saveMany($menus);
        });
    }
}
