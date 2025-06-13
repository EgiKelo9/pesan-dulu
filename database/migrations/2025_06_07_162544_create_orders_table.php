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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->dateTimeTz('tanggal_pesanan');
            $table->string('nama_pemesan');
            $table->string('telepon_pemesan', 15);
            $table->enum('status', ['menunggu', 'diterima', 'siap', 'diambil', 'gagal'])
                ->default('menunggu');
            $table->bigInteger('total_harga')->default(0);
            $table->foreignId('tenant_id')
                ->constrained('tenants')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
