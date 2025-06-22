<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_menu', function (Blueprint $table) {
            $table->foreignId('order_id')
                ->constrained('orders')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreignId('menu_id')
                ->constrained('menus')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->integer('jumlah')->default(1);
            $table->bigInteger('harga_satuan')->default(0);
            $table->bigInteger('total_harga')->default(0);
            $table->string('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_menu');
    }
};
