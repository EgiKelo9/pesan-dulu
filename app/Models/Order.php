<?php

namespace App\Models;

use App\Models\Report;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    public function addOrderMenu(int $menuId, int $jumlah, int $hargaSatuan, string $catatan): void
    {
        $totalHarga = $hargaSatuan * $jumlah;
        $this->menus()->attach([
            $menuId => [
                'jumlah' => $jumlah,
                'harga_satuan' => $hargaSatuan,
                'total_harga' => $totalHarga,
                'catatan' => $catatan,
            ]
        ]);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }

    public function report(): HasMany
    {
        return $this->hasMany(Report::class, 'order_id');
    }

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'order_menu', 'order_id', 'menu_id')
            ->withPivot('jumlah', 'harga_satuan', 'total_harga', 'catatan')
            ->withTimestamps();
    }
}
