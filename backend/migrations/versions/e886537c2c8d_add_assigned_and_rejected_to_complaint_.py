"""Add assigned and rejected to complaint status enum

Revision ID: e886537c2c8d
Revises: d5f3240f4617
Create Date: 2025-12-14 11:39:16.446016

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e886537c2c8d'
down_revision: Union[str, Sequence[str], None] = 'd5f3240f4617'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("ALTER TYPE complaintstatus ADD VALUE IF NOT EXISTS 'assigned'")
    op.execute("ALTER TYPE complaintstatus ADD VALUE IF NOT EXISTS 'rejected'")

def downgrade():
    pass