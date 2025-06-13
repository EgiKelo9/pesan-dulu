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
        Tenant::factory(4)->create();
        Category::factory(20)->recycle([Tenant::all()])->create();
        Menu::factory(100)->recycle([Tenant::all(), Category::all()])->create();
        Order::factory(50)->recycle([Tenant::all()])->create();
    }
}
