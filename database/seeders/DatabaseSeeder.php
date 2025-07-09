<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\User;
use App\Models\Tenant;
use App\Models\Category;
use App\Models\Order;
use Illuminate\Database\Seeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(1, ['role' => 'admin'])->create();
        User::factory(10)->withTenantAndCategories()->create();
        Order::factory(200)->recycle([Tenant::all()])->withMenus()->create();
    }
}
