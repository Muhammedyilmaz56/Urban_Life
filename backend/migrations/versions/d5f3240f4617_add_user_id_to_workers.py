"""add user_id to workers

Revision ID: d5f3240f4617
Revises: c5480c73aded
Create Date: 2025-12-13 08:13:18.057952

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd5f3240f4617'
down_revision: Union[str, Sequence[str], None] = 'c5480c73aded'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "workers",
        sa.Column("user_id", sa.Integer(), nullable=True)
    )
    op.create_unique_constraint(
        "uq_workers_user_id",
        "workers",
        ["user_id"]
    )
    op.create_foreign_key(
        "fk_workers_user_id_users",
        "workers",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )

def downgrade():
    op.drop_constraint("fk_workers_user_id_users", "workers", type_="foreignkey")
    op.drop_constraint("uq_workers_user_id", "workers", type_="unique")
    op.drop_column("workers", "user_id")